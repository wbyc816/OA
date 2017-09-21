<template>
  <div class="organlist" v-loading="organLoading">
    <el-menu mode="vertical" :router="false" class="topMenu">
      <my-menu-item :depts="depts" v-if="depts.length>0"></my-menu-item>
    </el-menu>
  </div>
</template>
<script>
import MyMenuItem from './menuItem'
import { mapGetters } from 'vuex'
export default {
  components: {
    MyMenuItem
  },
  data() {
    return {
      organLoading: true
    }
  },
  created() {
    // if(this.depts != '' || this.depts != undefined || this.depts != null){
    //   this.organLoading = false;
    // }
    console.log(this.organLoading)
  },
  mounted(){
    console.log(this.organLoading)
    
  },
  computed: {
    ...mapGetters([
      'depts'
    ])
  },
  watch: {
    depts: function(newValue) {
      if (newValue != '' || newValue != undefined || newValue != null) {

        this.organLoading = false;
      }
      console.log(this.organLoading)
    }
  },
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.organlist {


  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 10px;
    right: 0px;
    height: 100%;
    background: #D8D8D8;
    border-right: 1px solid #F2F2F2;
    z-index: 5;
  }

  .topMenu {
    position: relative; // padding: 0 8px;
    padding-right: 3px;
    box-shadow: none;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom:250px;
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      position: absolute;
      width: 5px;
      background-color: transparent;
      height: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #D8D8D8;
    }
    i {
      color: #393939!important;
    }
    >.menu-wrapper {
      >.el-submenu {
        >.el-menu {
          >.menu-wrapper {
            //二级
            >.el-menu-item {
              padding: 0 10px 0 20px !important;
              color: $sub;
              border-bottom: 1px solid #F2F2F2;
            }
            >.el-submenu {
              >.el-submenu__title {
                color: $sub;
                border-bottom: 1px solid #F2F2F2;
              }
              >.el-menu {
                >.menu-wrapper {
                  //三级
                  >.el-menu-item {
                    padding: 0 10px 0 20px !important;
                  }
                  .el-menu-item {
                    height: 35px;
                    line-height: 35px;
                  }
                  >.el-submenu {
                    .el-submenu__title {
                      height: 35px;
                      line-height: 35px;
                    }
                    >.el-menu {
                      >.menu-wrapper {
                        //四级
                        >.el-menu-item {
                          padding: 0 10px 0 40px !important;
                        }
                        >.el-submenu {
                          >.el-submenu__title {
                            padding: 0 10px 0 40px !important;
                          }
                          >.el-menu {
                            >.menu-wrapper {
                              >.el-menu-item {
                                padding-left: 60px!important;
                              }
                              >.el-submenu {
                                >.el-submenu__title {
                                  padding: 0 10px 0 60px !important;
                                }
                                >.el-menu {
                                  >.menu-wrapper {
                                    >.el-menu-item {
                                      padding-left: 80px!important;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .el-submenu__title {
      padding: 0 10px 0 20px !important;
    }
    .is-opened {
      &>.el-submenu__title {}
    }
    .el-menu {
      background-color: #fff;
    } // &>.el-submenu {
    //   border-bottom: 1px solid #F2F2F2;
    //   .el-menu-item{
    //     background-color:#fff;
    //   }
    //   &>.child {
    //     padding: 0;
    //     &>.el-submenu__title {
    //       border-bottom: none;
    //       color: $sub;
    //       i {
    //         color: #393939;
    //       }
    //     }
    //     &>.el-submenu {
    //       .el-menu {
    //         border-bottom: none;
    //         .el-menu-item {
    //           padding-left: 30px !important;
    //           color: #909090;
    //         }
    //       }
    //     }
    //   }
    // }
    // .longTitle {
    //   &>.el-submenu__title {
    //     line-height: initial;
    //     padding-top: 7px !important;
    //   }
    // }
  }
}

</style>
