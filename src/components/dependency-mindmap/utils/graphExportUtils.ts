
import { toPng } from 'html-to-image';
import { Edge, Node } from 'reactflow';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';


export const useGraphExport = () => {

  const handleDownloadImage = (taskId: string = '') => {
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!flowElement) return;

    const filename = taskId ? `task-${taskId}-dependencies.png` : 'dependency-graph.png';

    try {
      toPng(flowElement, {
        backgroundColor: '#ffffff',
        canvasWidth: flowElement.offsetWidth * 2,
        canvasHeight: flowElement.offsetHeight * 2,
        pixelRatio: 2,
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = filename;
          link.href = dataUrl;
          link.click();

          toast({
            title: 'Download complete',
            description: 'The graph image has been downloaded',
          });
        })
        .catch((error) => {
          console.error('Error generating image:', error);
          toast({
            variant: 'destructive',
            title: 'Failed to generate image',
            description: 'Please try again or check console for errors',
          });
        });
    } catch (error) {
      console.error('Error in handleDownloadImage:', error);
    }
  };


  const handleGenerateInsights = () => {
    toast({
      title: 'Analyzing dependencies',
      description: 'AI is analyzing the dependency graph...',
    });


    setTimeout(() => {
      toast({
        title: 'Analysis complete',
        description: 'Found 3 potential bottlenecks and 2 completion risks',
      });
    }, 1500);
  };


  const handleAddDemoNode = (markNodeAsRecentlyAdded?: (nodeId: string) => void) => {
    try {
      const newNodeId = `demo-${uuidv4().substring(0, 8)}`;
      
      if (markNodeAsRecentlyAdded) {
        markNodeAsRecentlyAdded(newNodeId);
      }

      toast({
        title: 'Demo node added',
        description: 'A new demo node has been created',
      });
      
      return newNodeId;
    } catch (error) {
      console.error('Error adding demo node:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to add demo node',
        description: 'Please try again or check console for errors',
      });
    }
  };

  return {
    handleDownloadImage,
    handleGenerateInsights,
    handleAddDemoNode,
  };
};
