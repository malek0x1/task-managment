
import { useMemo } from 'react';
import { TypedNode, TypedEdge, GraphData } from '../types/nodeTypes';
import { Task, Subtask } from '@/types/kanban';
import useDependencyGraphStore from '@/store/dependencyGraph';

const noop = () => {};

export const useGraphGeneration = (
  taskId: string | null,
  tasks: Task[]
): GraphData => {
  const { collapsedNodes, toggleNodeCollapse, setSubtaskCompletion } = useDependencyGraphStore();

  const hasSubChildren = (subtask: Subtask, map: Map<string, Subtask[]>) => !!map.get(subtask.id)?.length;

  return useMemo<GraphData>(() => {
    const nodes: TypedNode[] = [];
    const edges: TypedEdge[] = [];

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { nodes, edges };

    const childMap = new Map<string, Subtask[]>();
    for (const sub of task.subtasks) {
      const parentKey = sub.parentSubtaskId ?? task.id;
      if (!childMap.has(parentKey)) childMap.set(parentKey, []);
      childMap.get(parentKey)!.push(sub);
    }

    nodes.push({
      id: task.id,
      type: 'taskNode',
      position: { x: 0, y: 0 },
      data: {
        label: task.title,
        type: 'taskNode',
        task,
        taskId: task.id,
        isCollapsed: collapsedNodes.has(task.id),
        hasChildren: !!childMap.get(task.id)?.length,
        onToggleCollapse: toggleNodeCollapse ?? noop,
        onAddSubtask: noop,
      },
    });

    function walk(parentId: string) {
      if (collapsedNodes.has(parentId)) return;
      for (const child of childMap.get(parentId) || []) {
        nodes.push({
          id: child.id,
          type: 'subtaskNode',
          position: { x: 0, y: 0 },
          data: {
            label: child.title,
            type: 'subtaskNode',
            subtask: child,
            taskId: task.id,
            hasChildren: hasSubChildren(child, childMap),
            isCollapsed: collapsedNodes.has(child.id),
            completed: child.completed,
            parentSubtaskId: child.parentSubtaskId ?? null,
            onToggleComplete: (subtaskId: string) => setSubtaskCompletion ? setSubtaskCompletion(subtaskId, true, task.id) : noop(),
            onToggleCollapse: toggleNodeCollapse ?? noop,
            onAddSubtask: noop,
          },
        });
        edges.push({
          id: `e-${parentId}-${child.id}`,
          source: parentId,
          target: child.id,
        });
        walk(child.id);
      }
    }

    walk(task.id);

    return { nodes, edges };
  }, [taskId, tasks, collapsedNodes, toggleNodeCollapse, setSubtaskCompletion]);
};

export default useGraphGeneration;
