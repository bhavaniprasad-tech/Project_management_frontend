import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../Redux/Project/Action';
import ProjectCard from '../Project/ProjectCard';

export const tags = [
  "all", "react", "nodejs", "javascript", "typescript", "nextjs","python",
  "express", "mongodb", "mysql", "springboot", "flask", "django", "angular"
];

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector(state => state.project);
  
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState(['all']);

  useEffect(() => {
    console.log('ProjectList mounted, fetching projects...');
    dispatch(fetchProjects({ category: null, tag: null }));
  }, [dispatch]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleTagChange = (value) => {
    if (value === 'all') {
      setSelectedTags(['all']);
    } else {
      const newTags = selectedTags.includes('all') 
        ? [value]
        : selectedTags.includes(value)
        ? selectedTags.filter(tag => tag !== value)
        : [...selectedTags, value];
      
      setSelectedTags(newTags.length === 0 ? ['all'] : newTags);
    }
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleScrollAreaScroll = (e) => {
    e.stopPropagation();
  };

  return (
    <div className='relative px-3 sm:px-5 lg:px-0 flex flex-col lg:flex-row gap-5 justify-center py-3 sm:py-5'>
      <section className='filterSection w-full lg:w-auto'>
        <Card className='p-3 sm:p-5 sticky top-10 bg-black text-white'>
          <div className='flex justify-between w-full lg:w-[20rem]'>
            <p className='text-lg sm:text-xl tracking-wider'>filters</p>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <MixerHorizontalIcon />
            </Button>
          </div>

          <CardContent className='mt-3 sm:mt-5'>
            <ScrollArea 
              className='space-y-5 sm:space-y-7 h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-y-auto' 
              onScroll={handleScrollAreaScroll}
              style={{ overscrollBehavior: 'contain' }}
            >
              <div>
                <h5 className='pb-2 sm:pb-3 text-gray-400 border-b text-sm sm:text-base'>Category</h5>
                <div className='pt-3 sm:pt-5'>
                  <div className='space-y-2 pt-3 sm:pt-5'>
                    <div className='flex items-center gap-2 flex-wrap max-w-full'>
                      <Checkbox 
                        id='cat-all' 
                        checked={selectedCategory === 'all'}
                        onCheckedChange={() => handleCategoryChange('all')}
                        className="w-4 h-4"
                      />
                      <Label htmlFor='cat-all' className="text-sm">all</Label>
                    </div>
                    <div className='flex items-center gap-2 flex-wrap max-w-full'>
                      <Checkbox 
                        id='cat-fullstack' 
                        checked={selectedCategory === 'fullstack'}
                        onCheckedChange={() => handleCategoryChange('fullstack')}
                        className="w-4 h-4"
                      />
                      <Label htmlFor='cat-fullstack' className="text-sm">fullstack</Label>
                    </div>
                    <div className='flex items-center gap-2 flex-wrap max-w-full'>
                      <Checkbox 
                        id='cat-frontend' 
                        checked={selectedCategory === 'frontend'}
                        onCheckedChange={() => handleCategoryChange('frontend')}
                        className="w-4 h-4"
                      />
                      <Label htmlFor='cat-frontend' className="text-sm">frontend</Label>
                    </div>
                    <div className='flex items-center gap-2 flex-wrap max-w-full'>
                      <Checkbox 
                        id='cat-backend' 
                        checked={selectedCategory === 'backend'}
                        onCheckedChange={() => handleCategoryChange('backend')}
                        className="w-4 h-4"
                      />
                      <Label htmlFor='cat-backend' className="text-sm">backend</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className='pt-1'>
                <h5 className='pb-2 sm:pb-3 text-gray-400 border-b text-sm sm:text-base'>Tag</h5>
                <div className='pt-3 sm:pt-5'>
                  <div className='space-y-2 pt-3 sm:pt-5'>
                    {tags.map((item) => (
                      <div key={item} className='flex items-center gap-2 flex-wrap'>
                        <Checkbox 
                          id={`tag-${item}`} 
                          checked={selectedTags.includes(item)}
                          onCheckedChange={() => handleTagChange(item)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`tag-${item}`} className="text-sm">{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section className='projectListSection w-full lg:w-[48rem] mt-5 lg:mt-0'>
        <div className='flex gap-2 items-center pb-3 sm:pb-5 justify-between'>
          <div className='relative p-0 w-full'>
            <Input
              onChange={handleSearchChange}
              placeholder='Search projects'
              className='px-8 sm:px-9 py-2 sm:py-3 text-sm sm:text-base'
            />
            <MagnifyingGlassIcon className='absolute top-2 sm:top-3 left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5' />
          </div>
        </div>

        <div>
          <div className='space-y-3 sm:space-y-5 min-h-[50vh] sm:min-h-[60vh] lg:min-h-[74vh]'>
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-sm sm:text-base">Loading projects...</p>
              </div>
            ) : projects && projects.length > 0 ? (
              projects
                .filter(project => {
                  // Filter by keyword
                  const matchesKeyword = keyword ? 
                    project.name.toLowerCase().includes(keyword.toLowerCase()) : true;
                  
                  // Filter by category
                  const matchesCategory = selectedCategory === 'all' ? 
                    true : project.category === selectedCategory;
                  
                  // Filter by tags
                  const matchesTags = selectedTags.includes('all') ? 
                    true : selectedTags.some(tag => project.tags && project.tags.includes(tag));
                  
                  return matchesKeyword && matchesCategory && matchesTags;
                })
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm sm:text-base">No projects found. Create your first project!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectList;
