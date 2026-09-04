import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Axios instance for all business API calls.
 *
 * Authentication is handled by Better Auth via the httpOnly session cookie,
 * so requests are sent with `withCredentials: true` and never carry an
 * Authorization header or localStorage tokens.
 */
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: on 401 the session cookie is invalid/expired.
// Better Auth's reactive useSession() will reflect the cleared session on the
// next get-session; we surface the rejection so callers can react.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthApiCall =
        url.includes('/auth/sign-in') ||
        url.includes('/auth/sign-up') ||
        url.includes('/auth/sign-out') ||
        url.includes('/auth/get-session');
      if (!isAuthApiCall) {
        // Session expired server-side; UI session state updates via useSession().
        window.dispatchEvent(new Event('havenstay.session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

// Toast / Notification Utilities using SweetAlert2
export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon,
    title,
  });
};

export const showConfirmDialog = async (
  title: string,
  text: string,
  confirmButtonText = 'Yes, confirm',
  isDestructive = false
) => {
  return Swal.fire({
    title,
    text,
    icon: isDestructive ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonColor: isDestructive ? '#e11d48' : '#0284c7',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    reverseButtons: true,
  });
};
