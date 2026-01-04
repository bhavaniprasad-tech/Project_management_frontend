import { Button } from '../../components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { useForm } from 'react-hook-form'
import { useRef } from 'react'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { createComment } from '../../Redux/Comment/Action'

const CreateCommentForm = ({ issueId, onCommentCreated }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const { user } = auth || {};
  
  const form = useForm({
    defaultValues: {
      content: '',
    },
  })

  const dialogCloseRef = useRef(null)

  const onSubmit = async (data) => {
    console.log("Creating comment:", data);
    console.log("Issue ID:", issueId);
    
    const commentData = {
      content: data.content,
      issueId: issueId,
      user: user
    };
    
    try {
      const result = await dispatch(createComment(commentData));
      console.log("Comment created:", result);
      form.reset();
      if (onCommentCreated) onCommentCreated();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form className="flex flex-col sm:flex-row gap-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="flex gap-2 items-center">
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                    <AvatarFallback className="text-black text-xs">
                      {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="border border-gray-700 py-2 px-3 text-xs sm:text-sm flex-1"
                      placeholder="add comment..."
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-gray-700 text-white text-xs sm:text-sm px-3 py-2 h-8 sm:h-auto w-full sm:w-auto touch-manipulation">
            Save
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateCommentForm
