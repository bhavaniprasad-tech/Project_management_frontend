import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import IssueCard from './IssueCard'
import { DialogTrigger,DialogContent,DialogHeader,DialogTitle } from '@/components/ui/dialog'
import { Button } from '../../components/ui/button'
import { PlusIcon } from 'lucide-react'
import CreateIssueForm from './CreateIssueForm'

const IssueList = ({ status, title, issues = [], projectId }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'border-red-500 bg-red-500/10';
      case 'in_progress': return 'border-yellow-500 bg-yellow-500/10';
      case 'done': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div>
      <Dialog>
        <Card className={`w-full sm:w-[280px] md:w-[300px] lg:w-[310px] text-white ${getStatusColor(status)} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm sm:text-base">
              <span>{title}</span>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                {issues.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-4">
            <div className='space-y-2'>
              {issues.length > 0 ? (
                issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} projectId={projectId} />
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">
                  <p className="text-xs sm:text-sm">No {title.toLowerCase()} tasks</p>
                  <p className="text-xs mt-1">All team members can add tasks</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2 hover:text-white text-xs sm:text-sm py-2">
                    <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4"/>
                    Create Issue</Button>
            </DialogTrigger>
          </CardFooter>
        </Card>
        <DialogContent className="bg-gray-900 text-white">
            <DialogHeader>
                <DialogTitle>Create Issue</DialogTitle>
                <CreateIssueForm projectId={projectId} status={status} />
            </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IssueList
