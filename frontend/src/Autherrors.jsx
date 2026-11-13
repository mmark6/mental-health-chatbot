export function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';

    case 'auth/wrong-password':
      return 'Your password is incorrect.';

    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';

    case 'auth/weak-password':
      return 'Please choose a stronger password with at least 6 characters.';

    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled. Please try again.';

    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Allow popups and try again.';

    case 'auth/unauthorized-domain':
      return 'This website domain is not authorized in Firebase Authentication.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a little and try again.';

    default:
      return error.message || 'Something went wrong. Please try again.';
  }
}