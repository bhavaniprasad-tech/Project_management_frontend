import { DotFilledIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { Card } from '../../components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge' // ✅ Correct Badge import
import { useNavigate } from 'react-router-dom' // ✅ Import useNavigate for navigation
import { useDispatch } from 'react-redux';
import { deleteProject, fetchProjectById } from '../../Redux/Project/Action';
import { useEffect } from 'react'

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  
  // Fallback data if project is not provided
  const projectData = project || {
    id: 1,
    name: 'Sample Project',
    description: 'This is a sample project description.',
    category: 'fullstack',
    tags: ['react', 'nodejs']
  };

  console.log('ProjectCard received project:', projectData);

  const handleDelete = async (projectId) => {
    console.log('Deleting project with ID:', projectId);
    const result = await dispatch(deleteProject(projectId));
    if (result?.success) {
      console.log('Project deleted successfully');
    } else {
      console.error('Failed to delete project:', result?.error);
    }
  }

  return (
    <Card className='p-3 sm:p-5 w-full lg:max-w-3xl bg-black text-white'>
      <div className='space-y-3 sm:space-y-5'>
        <div className='space-y-2'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-2 sm:gap-5 flex-wrap'>
              <h5 onClick={() => navigate(`/Project/${projectData.id}`)} className='cursor-pointer font-bold text-sm sm:text-base break-words'>
                {projectData.name}
              </h5>
              <DotFilledIcon className="hidden sm:block" />
              <p className='text-xs sm:text-sm text-gray-400'>{projectData.category}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className='rounded-full hover:bg-gray-700 w-8 h-8 sm:w-10 sm:h-10'
                  variant='ghost'
                  size='icon'
                >
                  <DotsVerticalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-gray-800 text-white border border-gray-600 shadow-lg w-32'>
                <DropdownMenuItem className='hover:bg-gray-700 focus:bg-gray-700 text-white cursor-pointer text-sm'>Update</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(projectData.id)} className='hover:bg-gray-700 focus:bg-gray-700 text-white cursor-pointer text-sm'>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className='text-gray-500 text-xs sm:text-sm leading-relaxed'>
          {projectData.description}
        </p>
      </div>

      <div className='flex flex-wrap gap-1 sm:gap-2 items-center mt-3 sm:mt-4'>
        {projectData.tags && projectData.tags.length > 0 ? (
          projectData.tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-white bg-black border-white text-xs px-2 py-1">
              {tag}
            </Badge>
          ))
        ) : (
          <Badge variant="outline" className="text-white bg-black border-white text-xs px-2 py-1">
            No tags
          </Badge>
        )}
      </div>
    </Card>
  )
}

export default ProjectCard
