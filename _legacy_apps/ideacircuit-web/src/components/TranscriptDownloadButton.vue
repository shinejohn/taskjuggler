<template>
  <div class="relative">
    <Button
      @click="handleDownload"
      :disabled="disabled || downloadStatus === 'downloading'"
      :variant="downloadStatus === 'complete' ? 'default' : 'secondary'"
      size="icon"
      class="rounded-full min-h-[44px] min-w-[44px]"
      :class="downloadStatus === 'complete' ? 'bg-green-500 hover:bg-green-600' : ''"
    >
      <LoaderIcon v-if="downloadStatus === 'downloading'" :size="20" class="animate-spin" />
      <CheckIcon v-else-if="downloadStatus === 'complete'" :size="20" />
      <FileTextIcon v-else :size="20" />
    </Button>
    <Badge
      v-if="downloadStatus === 'downloading'"
      variant="default"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white whitespace-nowrap"
    >
      Preparing transcript...
    </Badge>
    <Badge
      v-if="downloadStatus === 'complete'"
      variant="default"
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white whitespace-nowrap"
    >
      Downloaded!
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DownloadIcon, FileTextIcon, CheckIcon, LoaderIcon } from 'lucide-vue-next';
import { Button, Badge } from '@/components/ui';

interface Props {
  sessionId?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();

const downloadStatus = ref<'idle' | 'downloading' | 'complete'>('idle');

const handleDownload = () => {
  if (props.disabled) return;
  downloadStatus.value = 'downloading';
  
  setTimeout(() => {
    const transcriptContent = `
Meeting Transcript - ${new Date().toLocaleString()}
Session ID: ${props.sessionId || 'unknown'}
John Doe: Hello everyone, thanks for joining today's meeting.
Jane Smith: Hi John, glad to be here.
Alex Johnson: Hello team, looking forward to the discussion.
John Doe: Let's start by reviewing our progress on the AI implementation project.
Jane Smith: We've completed the data preprocessing phase and are now moving to model training.
Alex Johnson: I have some concerns about the timeline. Can we discuss the deployment schedule?
John Doe: Certainly. The current plan is to deploy the first version in two weeks.
Jane Smith: That seems ambitious given the remaining testing requirements.
Alex Johnson: I agree with Jane. We should consider adding an extra week for quality assurance.
John Doe: That's a good point. Let's adjust the timeline to include additional testing.
Jane Smith: Perfect, I'll update the project plan accordingly.
Alex Johnson: Thank you, that addresses my concerns.
John Doe: Any other topics we need to cover today?
Jane Smith: Not from my side.
Alex Johnson: We're all set. Thanks everyone.
John Doe: Great, let's wrap up then. Have a great day!
    `.trim();
    
    const element = document.createElement('a');
    const file = new Blob([transcriptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `meeting-transcript-${new Date().toISOString().substring(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    downloadStatus.value = 'complete';
    setTimeout(() => {
      downloadStatus.value = 'idle';
    }, 3000);
  }, 1500);
};
</script>

