import { useSelector } from 'react-redux';

const DebugRedux = () => {
    const issueState = useSelector(state => state.issue);
    const projectState = useSelector(state => state.project);
    const authState = useSelector(state => state.auth);

    return (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md text-xs z-50">
            <h3 className="font-bold mb-2">Redux Debug Info:</h3>
            <div className="space-y-2">
                <div>
                    <strong>Auth:</strong> {authState.user ? 'Logged In' : 'Not Logged In'}
                </div>
                <div>
                    <strong>Project Loading:</strong> {projectState.loading ? 'Yes' : 'No'}
                </div>
                <div>
                    <strong>Project Error:</strong> {projectState.error || 'None'}
                </div>
                <div>
                    <strong>Issues Loading:</strong> {issueState.loading ? 'Yes' : 'No'}
                </div>
                <div>
                    <strong>Issues Count:</strong> {issueState.issues?.length || 0}
                </div>
                <div>
                    <strong>Issues Error:</strong> {issueState.error || 'None'}
                </div>
            </div>
        </div>
    );
};

export default DebugRedux;
