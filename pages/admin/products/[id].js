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

// Add this before the ProductForm component
const TINYMCE_API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  stock: Yup.number().min(0, 'Stock must be positive').required('Stock is required'),
  categoryId: Yup.string().required('Category is required'),
  status: Yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  features: Yup.array().of(Yup.string()),
  specifications: Yup.object(),
  images: Yup.array().min(1, 'At least one image is required')
});

function ProductForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      status: 'active',
      features: [''],
      specifications: {},
      images: []
    },
    validationSchema,
    onSubmit: handleSubmit
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchProduct();
    } else {
      setLoading(false);
    }
    fetchCategories();
  }, [isEdit, id]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product from:', `${API_URL}/api/admin/products/${id}`);
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Product fetch error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Product data received:', data);
      formik.setValues({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.category.id,
        status: data.status,
        features: data.features || [''],
        specifications: data.specifications || {},
        images: data.images || []
      });
      setImagePreviews(data.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      showNotification(error.message || 'Failed to fetch product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from:', `${API_URL}/api/categories`);
      const response = await fetch(`${API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Categories fetch error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Categories data received:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification(error.message || 'Failed to fetch categories', 'error');
    }
  };

  async function handleSubmit(values) {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'specifications') {
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === 'features') {
          formData.append(key, JSON.stringify(values[key].filter(Boolean)));
        } else if (key === 'images') {
          values[key].forEach(image => {
            if (image instanceof File) {
              formData.append('images', image);
            }
          });
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await fetch(
        `${API_URL}/api/admin/products${isEdit ? `/${id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} product`);
      }

      showNotification(`Product ${isEdit ? 'updated' : 'created'} successfully`);
      router.push('/admin/products');
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} product:`, error);
      showNotification(`Failed to ${isEdit ? 'update' : 'create'} product`, 'error');
    } finally {
      setSaving(false);
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    formik.setFieldValue('features', [...formik.values.features, '']);
  };

  const removeFeature = (index) => {
    const features = [...formik.values.features];
    features.splice(index, 1);
    formik.setFieldValue('features', features);
  };

  const addSpecification = () => {
    const key = prompt('Enter specification key:');
    if (key) {
      formik.setFieldValue('specifications', {
        ...formik.values.specifications,
        [key]: ''
      });
    }
  };

  const removeSpecification = (key) => {
    const specifications = { ...formik.values.specifications };
    delete specifications[key];
    formik.setFieldValue('specifications', specifications);
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
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    {...formik.getFieldProps('name')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
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
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    id="price"
                    {...formik.getFieldProps('price')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    {...formik.getFieldProps('stock')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {formik.touched.stock && formik.errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.stock}</p>
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
              </div>
            </div>

            {/* Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
              <div>
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
            </div>

            {/* Features */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Features</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Feature
                </button>
              </div>

              {formik.values.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const features = [...formik.values.features];
                      features[index] = e.target.value;
                      formik.setFieldValue('features', features);
                    }}
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter feature"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Specification
                </button>
              </div>

              {Object.entries(formik.values.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={key}
                    disabled
                    className="w-1/3 block border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 sm:text-sm"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      formik.setFieldValue('specifications', {
                        ...formik.values.specifications,
                        [key]: e.target.value
                      });
                    }}
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Images */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="h-32 w-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                <label className="h-32 w-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </label>
              </div>
              {formik.touched.images && formik.errors.images && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.images}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
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
                  'Save Product'
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

export default withAuth(ProductForm);
