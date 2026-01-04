import React, { useState } from 'react'
import Signup from './Signup'
import Login from './Login'
import { Button } from '../../components/ui/button'
import "./Auth.css";

const Auth = () => {
  const [active, setActive] = useState(false) // Start with Login instead of Signup

  return (
    <div className='auth-container min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='loginContainer w-full max-w-md'>
        <div className='box h-auto sm:h-[35rem] w-full sm:w-[28rem] mx-auto'>
          <div className='minContainer login'>
            <div className='loginBox w-full px-4 sm:px-8 py-4 sm:py-6 space-y-4 overflow-y-auto max-h-full'>
              {active ? <Signup /> : <Login />}

              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm gap-2">
                <span className="text-gray-300 text-center sm:text-left">
                  {active ? "Already have an account?" : "Don't have account? Create account"}
                </span>
                <Button variant="ghost" onClick={() => setActive(!active)} className="text-blue-400 hover:text-blue-300 w-full sm:w-auto">
                  {active ? "Sign in" : "Sign up"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
