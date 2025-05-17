import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '../../../components/admin/AdminLayout';
import Notification from '../../../components/common/Notification';
import { withAuth } from '../../../middleware/auth';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string(),
  categoryId: Yup.string().required('Category is required'),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  image: Yup.mixed(),
  symptoms: Yup.array().of(Yup.string()),
  treatments: Yup.array().of(Yup.string()),
  precautions: Yup.array().of(Yup.string())
});

function AilmentForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      status: 'active',
      image: null,
      symptoms: [''],
      treatments: [''],
      precautions: ['']
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  useEffect(() => {
    if (isEdit) {
      fetchAilment();
    }
    fetchCategories();
  }, [isEdit, id]);

  const fetchAilment = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/ailments/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ailment');
      }

      const data = await response.json();
      formik.setValues({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        categoryId: data.category?.id || '',
        status: data.status,
        image: null,
        symptoms: data.symptoms?.length ? data.symptoms : [''],
        treatments: data.treatments?.length ? data.treatments : [''],
        precautions: data.precautions?.length ? data.precautions : ['']
      });
      setImagePreview(data.image);
    } catch (error) {
      console.error('Error fetching ailment:', error);
      showNotification('Failed to fetch ailment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('Failed to fetch categories', 'error');
    }
  };

  async function handleSubmit(values) {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== null && values[key] !== '') {
          if (Array.isArray(values[key])) {
            formData.append(key, JSON.stringify(values[key].filter(item => item.trim() !== '')));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/ailments${isEdit ? `/${id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} ailment`);
      }

      showNotification(`Ailment ${isEdit ? 'updated' : 'created'} successfully`);
      router.push('/admin/ailments');
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} ailment:`, error);
      showNotification(`Failed to ${isEdit ? 'update' : 'create'} ailment`, 'error');
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
      formik.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = () => {
    const slug = formik.values.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    formik.setFieldValue('slug', slug);
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newValues = [...formik.values[field]];
    newValues[index] = value;
    formik.setFieldValue(field, newValues);
  };

  const addArrayFieldItem = (field) => {
    formik.setFieldValue(field, [...formik.values[field], '']);
  };

  const removeArrayFieldItem = (field, index) => {
    const newValues = formik.values[field].filter((_, i) => i !== index);
    formik.setFieldValue(field, newValues.length ? newValues : ['']);
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
            {isEdit ? 'Edit Ailment' : 'Add New Ailment'}
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="name"
                      {...formik.getFieldProps('name')}
                      className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Generate Slug
                    </button>
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    id="slug"
                    {...formik.getFieldProps('slug')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {formik.touched.slug && formik.errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.slug}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="categoryId"
                    {...formik.getFieldProps('categoryId')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.categoryId && formik.errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.categoryId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    {...formik.getFieldProps('status')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.status}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    rows={4}
                    {...formik.getFieldProps('description')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Ailment Image</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="h-32 w-32 flex-shrink-0">
                      <img
                        src={imagePreview || '/placeholder.png'}
                        alt="Ailment"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        Change Image
                      </label>
                      {formik.touched.image && formik.errors.image && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.image}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                  <div className="mt-2 space-y-2">
                    {formik.values.symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={symptom}
                          onChange={(e) => handleArrayFieldChange('symptoms', index, e.target.value)}
                          className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter symptom"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayFieldItem('symptoms', index)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayFieldItem('symptoms')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Symptom
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Treatments</label>
                  <div className="mt-2 space-y-2">
                    {formik.values.treatments.map((treatment, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={treatment}
                          onChange={(e) => handleArrayFieldChange('treatments', index, e.target.value)}
                          className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter treatment"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayFieldItem('treatments', index)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayFieldItem('treatments')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Treatment
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Precautions</label>
                  <div className="mt-2 space-y-2">
                    {formik.values.precautions.map((precaution, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={precaution}
                          onChange={(e) => handleArrayFieldChange('precautions', index, e.target.value)}
                          className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter precaution"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayFieldItem('precautions', index)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayFieldItem('precautions')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Precaution
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/ailments')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Ailment'
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

export default withAuth(AilmentForm);
