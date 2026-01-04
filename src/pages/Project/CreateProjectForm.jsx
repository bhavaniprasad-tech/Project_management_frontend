import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { DialogClose } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../../components/ui/select';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../Redux/Project/Action';

// Replace this with your actual tags list
export const tags = [
  'react', 'node', 'express', 'mongodb', 'django',
  'nextjs', 'tailwind', 'springboot', 'typescript',
  'python', 'java', 'graphql', 'docker'
];

const CreateProjectForm = () => {
  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      tags: ['javascript', 'react'
      ] // important fix: initialize as array
    }
  });

  const handleTagsChange = (newValue) => {
    const currentTags = form.getValues('tags');
    const updatedTags = currentTags.includes(newValue)
      ? currentTags.filter(tag => tag !== newValue)
      : [...currentTags, newValue];

    form.setValue('tags', updatedTags);
  };

  const onsubmit = async (data) => {
    console.log('Creating project with data:', data);
    const result = await dispatch(createProject(data));
    if (result?.success) {
      console.log('Project created successfully:', result.data);
      form.reset();
    } else {
      console.error('Failed to create project:', result?.error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onsubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-2 px-4"
                    placeholder="Project Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-2 px-4"
                    placeholder="Project Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full border border-gray-700 py-2 px-4 bg-black text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white border border-gray-700 rounded-md">
                      {['fullstack', 'frontend', 'backend'].map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="p-3 hover:bg-gray-800 border-b border-gray-600"
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={(value) => handleTagsChange(value)}>
                    <SelectTrigger className="w-full border border-gray-700 py-2 px-4 bg-black text-white">
                      <SelectValue placeholder="Tags" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white border border-gray-700 rounded-md max-h-60 overflow-y-auto">
                      {tags.map((item) => (
                        <SelectItem
                          key={item}
                          value={item}
                          className="p-3 hover:bg-gray-800 border-b border-gray-600"
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <div className="flex gap-2 flex-wrap mt-3">
                  {field.value.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleTagsChange(item)}
                      className="flex items-center rounded-full bg-gray-800 text-white px-3 py-1 cursor-pointer"
                    >
                      <span>{item}</span>
                      <X
                        className="ml-2 w-4 h-4 border border-transparent rounded-full hover:border-white transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <DialogClose asChild>
            <Button
              type="submit"
              className="mt-4 w-full py-5 px-5 bg-black text-white border border-gray-700 hover:bg-gray-900"
            >
              Create Project
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  );
};

export default CreateProjectForm;
