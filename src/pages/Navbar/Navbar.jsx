import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../../components/ui/dropdown-menu"
import { Button } from '../../components/ui/button'
import { PersonIcon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import CreateProjectForm from "../Project/CreateProjectForm"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../Redux/Auth/Action'

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // Debug user data
  console.log("Auth user data:", auth?.user);
  console.log("Available user properties:", auth?.user ? Object.keys(auth.user) : "No user data");

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth');
  }
  return (
    <div className='border-b py-3 sm:py-4 px-3 sm:px-5 flex items-center justify-between'>
      {/* Left Section */}
      <div className='flex items-center gap-2 sm:gap-3 flex-wrap'>
        <p onClick={() =>navigate("/")} className='cursor-pointer text-base sm:text-lg font-semibold truncate'>Project Management</p>

        {/* New Project Dialog - Hidden on mobile, shown on larger screens */}
        <div className='hidden sm:block'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">New Project</Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white w-[95vw] sm:w-full max-w-md">
              <DialogHeader className="text-white">
                Create New Project
              </DialogHeader>
              <CreateProjectForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Upgrade Button - Smaller on mobile */}
        <Button onClick={() => navigate("/upgrade_plan")} variant="default" size="sm" className='text-xs sm:text-sm px-2 sm:px-4'>Upgrade</Button>
      </div>

      {/* Right Section: Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full border-2 border-gray-500 p-0 w-8 h-8 sm:w-10 sm:h-10">
              <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                <AvatarFallback className="bg-gray-700 text-white text-xs sm:text-sm">
                  {(auth?.user?.fullName || auth?.user?.name || auth?.user?.username || auth?.user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-black w-32">
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-sm">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className='hidden sm:block text-sm truncate max-w-32'>{auth?.user?.fullName || auth?.user?.name || auth?.user?.username || auth?.user?.email || 'User'}</p>
      </div>

      {/* Mobile New Project Button - Fixed at bottom */}
      <div className='sm:hidden fixed bottom-4 right-4 z-50'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="icon" className='rounded-full w-14 h-14 shadow-lg'>+</Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white w-[95vw] max-w-md">
            <DialogHeader className="text-white">
              Create New Project
            </DialogHeader>
            <CreateProjectForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Navbar
