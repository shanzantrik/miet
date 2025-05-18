import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/admin/AdminLayout';
import Notification from '../../../components/common/Notification';
import { withAuth } from '../../../middleware/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Import Quill styles
import 'react-quill/dist/quill.snow.css';

// Add this before the ConsultantForm component
const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  categories: Yup.array().min(1, 'Select at least one category').required('Categories are required'),
  ailments: Yup.array().min(1, 'Select at least one specialization').required('Specializations are required'),
  description: Yup.string().required('Description is required'),
  experience: Yup.number().min(0, 'Experience must be positive').required('Experience is required'),
  education: Yup.string().required('Education is required'),
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
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [ailments, setAilments] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      categories: [],
      ailments: [],
      description: '',
      experience: '',
      education: '',
      services: [{ name: '', price: '', duration: '' }]
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  useEffect(() => {
    if (isEdit) {
      fetchConsultant();
    }
    fetchCategories();
    fetchAilments();
  }, [isEdit, id]);

  const fetchConsultant = async () => {
    try {
      const response = await fetch(`${API_URL}/api/consultants/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch consultant');
      }

      const data = await response.json();
      formik.setValues({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        categories: data.categories.map(c => c.id),
        ailments: data.ailments.map(a => a.id),
        description: data.bio || '',
        experience: data.experience || '',
        education: data.education || '',
        services: data.services?.map(s => ({
          name: s.name,
          price: s.price,
          duration: s.duration
        })) || [{ name: '', price: '', duration: '' }]
      });
      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error) {
      console.error('Error fetching consultant:', error);
      showNotification('Failed to fetch consultant', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('Failed to fetch categories', 'error');
    }
  };

  const fetchAilments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ailments`);
      if (!response.ok) throw new Error('Failed to fetch ailments');
      const data = await response.json();
      setAilments(data);
    } catch (error) {
      console.error('Error fetching ailments:', error);
      showNotification('Failed to fetch ailments', 'error');
    }
  };

  async function handleSubmit(values) {
    setSaving(true);
    try {
      const formData = new FormData();

      // Add user data
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('address', values.address);

      // Add consultant data
      formData.append('bio', values.description);
      formData.append('experience', values.experience);
      formData.append('education', values.education);

      // Add arrays
      values.categories.forEach(categoryId => {
        formData.append('categories[]', categoryId);
      });

      values.ailments.forEach(ailmentId => {
        formData.append('ailments[]', ailmentId);
      });

      // Add services as JSON
      formData.append('services', JSON.stringify(values.services));

      // Add image if exists
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(
        `${API_URL}/api/consultants${isEdit ? `/${id}` : ''}`,
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} consultant`);
      }

      showNotification(`Consultant ${isEdit ? 'updated' : 'created'} successfully`);
      router.push('/admin/consultants');
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} consultant:`, error);
      showNotification(error.message || `Failed to ${isEdit ? 'update' : 'create'} consultant`, 'error');
    } finally {
      setSaving(false);
    }
  }

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
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            {isEdit ? 'Edit Consultant' : 'Add New Consultant'}
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                    }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                    }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
                    }`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''
                    }`}
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Categories</label>
                <select
                  multiple
                  name="categories"
                  value={formik.values.categories}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.categories && formik.errors.categories ? 'border-red-500' : ''
                    }`}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formik.touched.categories && formik.errors.categories && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.categories}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Specializations</label>
                <select
                  multiple
                  name="ailments"
                  value={formik.values.ailments}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.ailments && formik.errors.ailments ? 'border-red-500' : ''
                    }`}
                >
                  {ailments.map((ailment) => (
                    <option key={ailment.id} value={ailment.id}>
                      {ailment.name}
                    </option>
                  ))}
                </select>
                {formik.touched.ailments && formik.errors.ailments && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.ailments}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.experience && formik.errors.experience ? 'border-red-500' : ''
                    }`}
                />
                {formik.touched.experience && formik.errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.experience}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formik.values.education}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formik.touched.education && formik.errors.education ? 'border-red-500' : ''
                    }`}
                />
                {formik.touched.education && formik.errors.education && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.education}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <ReactQuill
                value={formik.values.description}
                onChange={(content) => formik.setFieldValue('description', content)}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['clean']
                  ]
                }}
                className="h-64 mb-12"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Services</label>
              <div className="space-y-4">
                {formik.values.services.map((service, index) => (
                  <div key={index} className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Service Name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => {
                          const services = [...formik.values.services];
                          services[index].name = e.target.value;
                          formik.setFieldValue('services', services);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => {
                          const services = [...formik.values.services];
                          services[index].price = e.target.value;
                          formik.setFieldValue('services', services);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                      <input
                        type="number"
                        value={service.duration}
                        onChange={(e) => {
                          const services = [...formik.values.services];
                          services[index].duration = e.target.value;
                          formik.setFieldValue('services', services);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addService}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Service
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
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
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Choose Image
                </label>
                {imagePreview && (
                  <div className="ml-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/consultants')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
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
