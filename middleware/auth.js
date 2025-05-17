import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function withAuth(WrappedComponent) {
  return function WithAuth(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}
