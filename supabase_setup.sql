
-- 1. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    team_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    has_completed_onboarding BOOLEAN DEFAULT false
);

-- Add RLS policies for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view their own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
CREATE POLICY "Users can insert their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE 
USING (auth.uid() = owner_id);

-- 2. Create columns table
CREATE TABLE IF NOT EXISTS public.columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    color TEXT,
    wip_limit INTEGER,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Add RLS policies for columns
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view columns of their projects" ON public.columns;
CREATE POLICY "Users can view columns of their projects" 
ON public.columns FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = columns.project_id 
        AND projects.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert columns to their projects" ON public.columns;
CREATE POLICY "Users can insert columns to their projects" 
ON public.columns FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = columns.project_id 
        AND projects.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can update columns of their projects" ON public.columns;
CREATE POLICY "Users can update columns of their projects" 
ON public.columns FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = columns.project_id 
        AND projects.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can delete columns of their projects" ON public.columns;
CREATE POLICY "Users can delete columns of their projects" 
ON public.columns FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = columns.project_id 
        AND projects.owner_id = auth.uid()
    )
);

-- 3. Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    column_id UUID NOT NULL REFERENCES public.columns(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    description TEXT,
    labels JSONB DEFAULT '[]'::jsonb,
    assignees JSONB DEFAULT '[]'::jsonb,
    subtasks JSONB DEFAULT '[]'::jsonb,
    due_date TEXT,
    time_estimate INTEGER,
    has_deep_subtasks BOOLEAN DEFAULT false,
    has_ai_assistant BOOLEAN DEFAULT false,
    has_automations BOOLEAN DEFAULT false,
    has_dependencies BOOLEAN DEFAULT false
);

-- Add RLS policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tasks of their projects" ON public.tasks;
CREATE POLICY "Users can view tasks of their projects" 
ON public.tasks FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = tasks.project_id 
        AND projects.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert tasks to their projects" ON public.tasks;
CREATE POLICY "Users can insert tasks to their projects" 
ON public.tasks FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = tasks.project_id 
        AND projects.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can update tasks of their projects" ON public.tasks;
CREATE POLICY "Users can update tasks of their projects" 
ON public.tasks FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = tasks.project_id 
        AND projects.owner_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can delete tasks of their projects" ON public.tasks;
CREATE POLICY "Users can delete tasks of their projects" 
ON public.tasks FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = tasks.project_id 
        AND projects.owner_id = auth.uid()
    )
);

-- Create stored procedures to create tables for convenience
CREATE OR REPLACE FUNCTION create_projects_table()
RETURNS VOID AS $$
BEGIN
    -- Projects table is already created above
    RAISE NOTICE 'Projects table is ready to use';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_columns_table()
RETURNS VOID AS $$
BEGIN
    -- Columns table is already created above
    RAISE NOTICE 'Columns table is ready to use';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_tasks_table()
RETURNS VOID AS $$
BEGIN
    -- Tasks table is already created above
    RAISE NOTICE 'Tasks table is ready to use';
END;
$$ LANGUAGE plpgsql;
