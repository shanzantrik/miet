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
  parentId: Yup.string(),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  image: Yup.mixed()
});

function CategoryForm() {
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
      parentId: '',
      status: 'active',
      image: null
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
    fetchCategories();
  }, [isEdit, id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }

      const data = await response.json();
      formik.setValues({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        parentId: data.parent?.id || '',
        status: data.status,
        image: null
      });
      setImagePreview(data.image);
    } catch (error) {
      console.error('Error fetching category:', error);
      showNotification('Failed to fetch category', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      // Filter out the current category and its children to prevent circular references
      const filteredCategories = isEdit
        ? data.filter(cat => cat.id !== id && !cat.parent?.id === id)
        : data;
      setCategories(filteredCategories);
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
          formData.append(key, values[key]);
        }
      });

      const response = await fetch(
        `http://localhost:5001/api/admin/categories${isEdit ? `/${id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} category`);
      }

      showNotification(`Category ${isEdit ? 'updated' : 'created'} successfully`);
      router.push('/admin/categories');
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} category:`, error);
      showNotification(`Failed to ${isEdit ? 'update' : 'create'} category`, 'error');
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
            {isEdit ? 'Edit Category' : 'Add New Category'}
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
                  <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent Category</label>
                  <select
                    id="parentId"
                    {...formik.getFieldProps('parentId')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">None</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700">Category Image</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="h-32 w-32 flex-shrink-0">
                      <img
                        src={imagePreview || '/placeholder.png'}
                        alt="Category"
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
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/categories')}
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
                  'Save Category'
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

export default withAuth(CategoryForm);
