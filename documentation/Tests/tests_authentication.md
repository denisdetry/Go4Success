# Authentication Tests Documentation

The authentication tests are located in the `apps/backend/authentification/tests` directory. They are designed to ensure
that the authentication system works as expected. The tests cover various aspects of the authentication process,
including user registration, login, password change, and user profile updates.

## Test Files

The authentication tests are divided into several files, each testing a specific view or functionality:

- `tests_urls.py`: This file contains tests for URL routing. It ensures that each URL correctly resolves to its
  associated view.

- `views/tests_change_password_view.py`: This file contains tests for the `ChangePasswordView`. It checks that the
  password change functionality works correctly, including various edge cases such as providing an incorrect old
  password or mismatched new passwords.

- `views/tests_current_user_view.py`: This file contains tests for the `CurrentUserView`. It checks that the view
  correctly returns the details of the currently authenticated user.

- `views/tests_delete_user_view.py`: This file contains tests for the `DeleteUserView`. It checks that a user can be
  correctly deleted, and handles cases where the deletion should not be allowed, such as when the provided password is
  incorrect.

- `views/tests_jwt_view.py`: This file contains tests for the JWT authentication views (`TokenObtainPairView`
  and `TokenRefreshView`). It checks that JWT tokens are correctly issued and refreshed.

- `views/tests_register_user_view.py`: This file contains tests for the `UserRegisterView`. It checks that user
  registration works correctly, including various edge cases such as registering with an already-used email or username.

- `views/tests_update_profile_view.py`: This file contains tests for the `UpdateProfileView`. It checks that a user's
  profile can be correctly updated, and handles cases where the update should not be allowed, such as when the provided
  email is already in use.

## Running the Tests

To run the tests, navigate to the root directory of the Django project and run the following command:

```bash
python manage.py test apps/backend/authentification/tests
```

This will run all the tests in the `apps/backend/authentification/tests` directory. If you want to run a specific test
file, you can specify it in the command, like so:

```bash
python manage.py test apps/backend/authentification/tests/views/tests_change_password_view.py
```

## Understanding the Test Results

After running the tests, you will see output indicating whether each test passed or failed. If a test fails, the output
will include details about what went wrong, which can help you diagnose and fix the issue.

Remember, passing tests mean that the code is behaving as expected according to the tests, but it doesn't necessarily
mean the code is perfect or bug-free. Always be sure to thoroughly test new code and changes to existing code to ensure
everything works as expected.