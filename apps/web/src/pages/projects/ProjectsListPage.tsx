import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchProjects } from '../../store/slices/projectSlice';
import { Button } from '../../components/ui/button';
import { Plus, Folder } from 'lucide-react';
import { projectApi } from '../../services/api';
import { toast } from 'sonner';
import { isAdmin } from '../../lib/utils';

export default function ProjectsListPage({ onNavigate }: { onNavigate: (page: string, id?: string) => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading } = useSelector((state: RootState) => state.projects);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async () => {
    try {
      if (!newProjectName) {
        toast.error('Project name is required');
        return;
      }
      await projectApi.createProject({ name: newProjectName, description: newProjectDesc });
      toast.success('Project created successfully');
      setIsCreating(false);
      setNewProjectName('');
      setNewProjectDesc('');
      dispatch(fetchProjects());
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage your projects and tasks.</p>
        </div>
        {isAdmin(user?.role) && (
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus size={16} /> New Project
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <input
                type="text"
                className="w-full rounded-md border border-border bg-background px-3 py-2"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreateProject}>Create</Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate('project-detail', project.id.toString())}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Folder size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {project.id}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
            </div>
          ))}
          {projects.length === 0 && !isLoading && (
            <div className="col-span-full text-center p-12 border border-dashed border-border rounded-lg">
              <Folder className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">No projects found. Create one to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
