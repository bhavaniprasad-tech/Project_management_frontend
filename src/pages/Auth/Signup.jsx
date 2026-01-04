import { Button } from '../../components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../Redux/Auth/Action'   // ✅ ensure correct filename: Action.js or action.js
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);   // get auth state from reducer

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(register(data));
    if (result?.success) {
      form.reset();
    }
  };

  // Remove this useEffect - let App.jsx handle the routing based on auth state
  // useEffect(() => {
  //   console.log("Signup auth state changed:", { user: auth.user, loading: auth.loading, error: auth.error });
  //   if (auth.user && !auth.loading) {
  //     console.log("Navigating to home page from signup...");
  //     navigate('/', { replace: true });
  //   }
  // }, [auth.user, auth.loading, navigate]);


  return (
    <div className="space-y-4">
      <h1 className="text-center text-lg sm:text-xl font-bold text-white">Register</h1>
      {auth.error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-3 py-2 rounded-md text-xs sm:text-sm">
          {auth.error}
        </div>
      )}
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="border w-full border-gray-700 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                    placeholder="Email..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                    placeholder="Full Name..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="border w-full border-gray-700 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                    placeholder="Password..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-gray-700 text-white w-full py-2 sm:py-3 text-sm sm:text-base touch-manipulation" disabled={auth.loading}>
            {auth.loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
