<template>
	<!-- Content Header (Page header) -->
	<div class="content-header">
	  <div class="container-fluid">
	    <div class="row mb-2">
	      <div class="col-sm-6">
	        <h1 class="m-0">{{ title }}</h1>
	      </div><!-- /.col -->
	      <div class="col-sm-6">
	        <ol class="breadcrumb float-sm-right">
			 <template :key="key" v-for="(breadcrumb,key) in breadcrumbs">
				<template v-if="breadcrumbs.length-1 == key">
					<li class="breadcrumb-item active">{{ breadcrumb.title}}</li>
				</template>	
				<template v-else>
					 <li class="breadcrumb-item"><a :href="breadcrumb.link || '#'">{{ breadcrumb.title}}</a></li>
				</template>	
			 </template>
	        
	        </ol>
	      </div><!-- /.col -->
	    </div><!-- /.row -->
	  </div><!-- /.container-fluid -->
	</div>
	<!-- /.content-header -->
	<!-- <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Starter Page</li> -->
</template>

<script>
	export default {
		props: {
			title: String,
			breadcrumbs: Object
		}
	}
</script>

              
           