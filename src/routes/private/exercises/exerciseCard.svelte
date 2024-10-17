<script lang="ts">
	import type { IExercise } from '$svc/exercises/model';
	import Icon from '@iconify/svelte';

	export let exercise: IExercise;


	const difficultyBadge = () => {
		switch (exercise.difficulty_level) {
			case 1:
				return 'bg-emerald-500';
			case 2:
				return 'bg-amber-500';
			case 3:
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	};
</script>

<div
	class="relative flex w-full items-center space-x-3 bg-white px-6 py-5 hover:bg-slate-100"
>
	<div class="flex-shrink-0">
        <Icon icon="hugeicons:book-edit" class="w-5 h-5" />
	</div>
	<div class="min-w-0 flex-1">
		<a href={`/private/exercises/${exercise.id}`} class="focus:outline-none">
			<span class="absolute inset-0" aria-hidden="true"></span>
			<p class="text-sm font-medium text-gray-900">{exercise.title}</p>
			<p class="truncate text-xs text-gray-500">{exercise.description}</p>
            <div class="mt-1 flex items-center justify-end gap-x-1.5">
                <div class="flex-none rounded-full {difficultyBadge()}/20 p-1">
                    <div class="h-1.5 w-1.5 rounded-full {difficultyBadge()}"></div>
                </div>
                <div class="text-xs">{exercise.difficulty_level === 1 ? 'Easy' : exercise.difficulty_level === 2 ? 'Medium' : 'Difficult'}</div>
            </div>
		</a>  
	</div>
    
</div>


