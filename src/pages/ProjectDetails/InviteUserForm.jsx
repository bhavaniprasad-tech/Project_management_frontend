import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { inviteToProject } from '@/Redux/Project/Action'
import { useParams } from 'react-router-dom'

const InviteUserForm = () => {
  const dispatch = useDispatch()
  const {id} = useParams()
  const [invitationLink, setInvitationLink] = useState('')
  const [showLink, setShowLink] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  const form = useForm({
    defaultValues: {
      email: '',
    },
  })

  const dialogCloseRef = useRef(null)

  const onSubmit = async (data) => {
    console.log("Inviting user:", data)
    const result = await dispatch(inviteToProject({email:data.email, projectId:id}))
    
    if (result.success && result.data.invitationLink) {
      setInvitationLink(result.data.invitationLink)
      setShowLink(true)
      console.log("✅ Invitation link ready to share:", result.data.invitationLink)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy invitation link:', err)
    }
  }

  const closeDialog = () => {
    setShowLink(false)
    setInvitationLink('')
    setCopySuccess(false)
    form.reset()
    dialogCloseRef.current?.click()
  }

  return (
    <div>
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="user email..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!showLink ? (
            <Button type="submit" className="bg-gray-700 text-white">
              Invite user
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  📧 Invitation Created Successfully!
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  Please share this invitation link manually:
                </p>
                <div className="bg-white p-3 rounded border border-green-300">
                  <p className="text-xs text-gray-600 break-all font-mono">
                    {invitationLink}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    type="button" 
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    {copySuccess ? '✅ Copied!' : '📋 Copy Link'}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={closeDialog}
                    className="bg-gray-600 hover:bg-gray-700 text-white text-sm"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogClose asChild>
            <button ref={dialogCloseRef} className="hidden" />
          </DialogClose>
        </form>
      </Form>
    </div>
  )
}

export default InviteUserForm
