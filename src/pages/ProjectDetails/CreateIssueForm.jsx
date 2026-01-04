import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createIssue } from '../../Redux/Issue/Action'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CreateIssueForm = ({ projectId, status = 'pending' }) => {
   const dispatch = useDispatch();
   const [priority, setPriority] = useState('medium');
   const { auth } = useSelector(store => store);
   const { user } = auth || {};
   
   const form = useForm({
      defaultValues: {
        title: '',
        description: ''
      },
    })
  
    const dialogCloseRef = useRef(null)
  
    const onSubmit = async (data) => {
      console.log("\n=== CREATING NEW ISSUE ===");
      console.log("Form data:", data);
      console.log("Project ID:", projectId);
      console.log("Status:", status);
      
      const issueData = {
        ...data,
        projectId: parseInt(projectId), // Ensure projectId is a number
        status: status,
        priority: priority, // Use dynamic priority from state
        dueDate: null, // Explicitly set dueDate to null to avoid backend issues
        createdAt: new Date().toISOString(), // Add frontend-generated creation timestamp
        reporter: user // Set reporter to currently logged-in user
      };
      
      console.log("Issue data being sent:", issueData);
      
      try {
        const result = await dispatch(createIssue(issueData));
        console.log("Create issue result:", result);
        
        if (result?.success !== false) {
          dialogCloseRef.current?.click();
          form.reset();
          setPriority('medium'); // Reset priority to default
          console.log("Issue created successfully");
          alert("Issue created successfully! Please refresh the page to see the new issue.");
          
          // Refresh issues list after creation
          const { fetchIssues } = await import('../../Redux/Issue/Action');
          dispatch(fetchIssues(projectId));
        } else {
          console.error("Failed to create issue:", result?.error);
          alert(`Failed to create issue: ${result?.error}`);
        }
      } catch (error) {
        console.error("Error creating issue:", error);
      }
    }
  
  return (
    <div>
      <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="border w-full border-gray-700 py-5 px-5 mt-3"
                          placeholder="Issue title..."
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
                          className="border w-full border-gray-700 py-5 px-5"
                          placeholder="Description..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Priority</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="w-full border-gray-700">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          High
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="bg-gray-700 text-white">
                  Create Issue
                </Button>
                <DialogClose asChild>
                  <button  ref={dialogCloseRef} className="hidden" />
                </DialogClose>
              </form>
            </Form>
    </div>
  )
}

export default CreateIssueForm
