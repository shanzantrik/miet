import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/admin/AdminLayout';
import Notification from '../../../components/common/Notification';
import { withAuth } from '../../../middleware/auth';
import { debounce } from 'lodash';
import { endpoints, getAuthHeaders } from '../../../utils/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Cache for categories and ailments
const cache = {
  categories: null,
  ailments: null,
  lastFetch: {
    categories: 0,
    ailments: 0
  }
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function for exponential backoff
const getRetryDelay = (retryCount) => {
  return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCount), 10000); // Max 10 seconds
};

// Update the ReactQuill dynamic import
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // Create a wrapper component that uses forwardRef
    return function QuillWrapper({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>
  }
);

// Import Quill styles
import 'react-quill/dist/quill.snow.css';


const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  categories: Yup.array().min(1, 'Select at least one category').required('Categories are required'),
  ailments: Yup.array().min(1, 'Select at least one specialization').required('Specializations are required'),
  description: Yup.string().required('Description is required'),
  services: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Service name is required'),
      price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
      duration: Yup.number().min(0, 'Duration must be positive').required('Duration is required')
    })
  ).min(1, 'Add at least one service').required('Services are required')
});

function ConsultantForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = Boolean(id) && id !== 'add';
  const quillRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [ailments, setAilments] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      categories: [],
      ailments: [],
      description: '',
      services: [{ name: '', price: '', duration: '' }]
    },
    validationSchema,
    onSubmit: async (values) => {
      setSaving(true);
      await submitForm(values);
    }
  });

  // Initialize form data
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // Fetch categories and ailments first
        const [categoriesRes, ailmentsRes] = await Promise.all([
          fetch(endpoints.categories.list),
          fetch(endpoints.ailments.list)
        ]);

        if (!categoriesRes.ok || !ailmentsRes.ok) {
          throw new Error('Failed to fetch form data');
        }

        const [categoriesData, ailmentsData] = await Promise.all([
          categoriesRes.json(),
          ailmentsRes.json()
        ]);

        setCategories(categoriesData);
        setAilments(ailmentsData);

        // If editing, fetch consultant data
        if (isEdit && id) {
          const consultantRes = await fetch(endpoints.consultants.get(id), {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              ...getAuthHeaders()
            }
          });

          if (!consultantRes.ok) {
            throw new Error('Failed to fetch consultant');
          }

          const consultantData = await consultantRes.json();
          console.log('Fetched consultant data:', consultantData);

          // Set form values with proper null checks
          formik.setValues({
            name: consultantData.user?.name || '',
            email: consultantData.user?.email || '',
            phone: consultantData.user?.phone || '',
            address: consultantData.user?.address || '',
            categories: consultantData.categories?.map(c => c.id) || [],
            ailments: consultantData.ailments?.map(a => a.id) || [],
            description: consultantData.bio || '',
            services: consultantData.services?.map(s => ({
              name: s.name || '',
              price: s.price || '',
              duration: s.duration || ''
            })) || [{ name: '', price: '', duration: '' }]
          });

          if (consultantData.image) {
            setImagePreview(consultantData.image);
          }
        }
      } catch (error) {
        console.error('Error initializing form:', error);
        showNotification('Failed to initialize form', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      init();
    }
  }, [router.isReady, id, isEdit]);

  const submitForm = async (values) => {
    try {
      setSaving(true);
      setError('');

      // Format the form data
      const formData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        bio: values.description,
        categories: Array.isArray(values.categories) ? values.categories : [values.categories].filter(Boolean),
        ailments: Array.isArray(values.ailments) ? values.ailments : [values.ailments].filter(Boolean),
        services: values.services.map(service => ({
          name: service.name,
          price: service.price,
          duration: service.duration
        }))
      };

      const url = isEdit
        ? `${API_URL}/api/admin/consultants/${id}`
        : `${API_URL}/api/admin/consultants`;

      console.log('Submitting form:', {
        url,
        method: isEdit ? 'PUT' : 'POST',
        isEdit,
        values: formData
      });

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(formData)
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit form');
      }

      console.log('Form submitted successfully:', data);
      showNotification(`Consultant ${isEdit ? 'updated' : 'created'} successfully`);
      router.push('/admin/consultants');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message);
      showNotification(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    formik.setFieldValue('services', [
      ...formik.values.services,
      { name: '', price: '', duration: '' }
    ]);
  };

  const removeService = (index) => {
    const services = [...formik.values.services];
    services.splice(index, 1);
    formik.setFieldValue('services', services);
  };

  // Add a function to handle Quill editor initialization
  const handleQuillInit = useCallback((editor) => {
    if (editor) {
      // Configure Quill to use modern event listeners
      editor.root.addEventListener('input', () => {
        formik.setFieldValue('description', editor.root.innerHTML);
      });
    }
  }, [formik]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {isEdit ? 'Edit Consultant' : 'Add New Consultant'}
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Categories</label>
                <select
                  multiple
                  name="categories"
                  value={formik.values.categories}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[120px] ${formik.touched.categories && formik.errors.categories ? 'border-red-500' : ''}`}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="py-2">
                      {category.name}
                    </option>
                  ))}
                </select>
                {formik.touched.categories && formik.errors.categories && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.categories}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Specializations</label>
                <select
                  multiple
                  name="ailments"
                  value={formik.values.ailments}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 min-h-[120px] ${formik.touched.ailments && formik.errors.ailments ? 'border-red-500' : ''}`}
                >
                  {ailments.map((ailment) => (
                    <option key={ailment.id} value={ailment.id} className="py-2">
                      {ailment.name}
                    </option>
                  ))}
                </select>
                {formik.touched.ailments && formik.errors.ailments && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.ailments}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Description</label>
                <div className="h-80 mb-12">
                  <ReactQuill
                    forwardedRef={quillRef}
                    value={formik.values.description}
                    onChange={(content) => formik.setFieldValue('description', content)}
                    onInit={handleQuillInit}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['clean']
                      ]
                    }}
                    theme="snow"
                    className="h-64 text-base"
                    preserveWhitespace={true}
                  />
                </div>
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-4">Services</label>
                <div className="space-y-6">
                  {formik.values.services.map((service, index) => (
                    <div key={index} className="flex items-end space-x-6">
                      <div className="flex-1">
                        <label className="block text-base font-semibold text-gray-700 mb-2">Service Name</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => {
                            const services = [...formik.values.services];
                            services[index].name = e.target.value;
                            formik.setFieldValue('services', services);
                          }}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-base font-semibold text-gray-700 mb-2">Price</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => {
                            const services = [...formik.values.services];
                            services[index].price = e.target.value;
                            formik.setFieldValue('services', services);
                          }}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-base font-semibold text-gray-700 mb-2">Duration (minutes)</label>
                        <input
                          type="number"
                          value={service.duration}
                          onChange={(e) => {
                            const services = [...formik.values.services];
                            services[index].duration = e.target.value;
                            formik.setFieldValue('services', services);
                          }}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addService}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Service
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">Profile Image</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Choose Image
                  </label>
                  {imagePreview && (
                    <div className="ml-6">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-6">
              <button
                type="button"
                onClick={() => router.push('/admin/consultants')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || isRetrying}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isRetrying ? `Retrying... (${retryCount}/${MAX_RETRIES})` : 'Saving...'}
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>

        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      </div>
    </AdminLayout>
  );
}

export default withAuth(ConsultantForm);
