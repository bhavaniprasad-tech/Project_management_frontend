import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../Redux/Comment/Action';


const CommentCard = ({ comment, onDelete }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const { user } = auth || {};

  const handleDeleteComment = async () => {
    console.log("Deleting comment:", comment.id);
    try {
      await dispatch(deleteComment(comment.id));
      if (onDelete) onDelete(comment.id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                <AvatarFallback className="text-black text-xs">
                  {comment?.user?.fullName?.charAt(0) || comment?.user?.name?.charAt(0) || comment?.author?.charAt(0) || 'U'}
                </AvatarFallback>
            </Avatar>

            <div className='space-y-1 flex-1 min-w-0'>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <p className="text-xs sm:text-sm font-medium break-words">
                    {comment?.user?.fullName || comment?.user?.name || comment?.author || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(comment?.createdAt || comment?.createdDate)}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 break-words leading-relaxed">{comment?.content || comment?.text || 'No content'}</p>
            </div>
        </div>
        {/* Only show delete button if current user is the comment author or admin */}
        {(comment?.user?.id === user?.id || !comment?.user) && (
          <Button 
            className="rounded-full w-6 h-6 sm:w-7 sm:h-7 p-0 hover:bg-red-600 flex-shrink-0 touch-manipulation" 
            variant="ghost" 
            size="sm"
            onClick={handleDeleteComment}
          >
              <TrashIcon className='text-white w-3 h-3 sm:w-4 sm:h-4'/>
          </Button>
        )}
    </div>
  )
}

export default CommentCard
