<template>
	<base-layout>
	  <template v-slot:header>
	   <PageHeader :title="title" :breadcrumbs="breadcrumbs"></PageHeader>
	  </template>
	  <template v-slot:default>
	  Hello
	  	
	  </template>
	</base-layout>
</template>

<script>
	import PageHeader from "../layouts/components/PageHeader"
	export default {
		components: {
			PageHeader
		},
		data: () => ({
			title: 'Dashboard',
			breadcrumbs: [
					{
						'title': 'Home',
						'link': '/'
					},
					{
						'title': 'Dashboard',
						'link': ''
					},
				]
			
		})
		
	}
</script>