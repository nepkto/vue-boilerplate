<template>
  <div class="wrapper">
    <NavBar/>
    
    <SideBar/>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <slot name="header"></slot>

      <!-- Main content -->
      <div class="content">
        <div class="container-fluid">
          <slot></slot>
         
        </div><!-- /.container-fluid -->
      </div>
      <!-- /.content -->
    </div>
    <ControllSiderBar/>
    <!-- /.content-wrapper -->
    <Footer/>
  </div>
</template>

<script>
  import NavBar from "../components/NavBar";
  import SideBar from "../components/SideBar";
  import ControllSiderBar from "../components/ControllSidebar";
  import Footer from "../components/Footer";
  // import PageHeader from "../components/PageHeader";
  export default {
    name: 'BaseLayout',
    components: {
      NavBar,
      SideBar,
      Footer,
      ControllSiderBar
    }
  }
</script>