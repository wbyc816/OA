<template>
<div class="box">
  <ul class="con1"  :class="{anim:animate==true}"> 

    <li v-for='item in items'>
      {{item.name}}
    </li>
    <li v-for='item in items'>
      {{item.name}}
    </li>
  </ul>

    <ul class="con1"  :class="{anim:animate==true}"> 

    <li v-for='item in items'>
      {{item.name}}
    </li>
    <li v-for='item in items'>
      {{item.name}}
    </li>
  </ul>
</div>


</template>

<script>
export default {
data() {
  return {
      animate:false,
      items:[
          {name:"1"},
          {name:"2"},
          {name:"3"},
          {name:"4"},
          {name:"5"},
          {name:"6"},
          {name:"7"},
          {name:"8"},
          {name:"9"},
          {name:"10"},
          {name:"11"},
          {name:"12"},
      ]
  }
},
created(){
    setInterval(this.scroll,5000)
},
methods: {
    scroll(){
       this.animate=true;    // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
       setTimeout(()=>{      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
               this.items.push(this.items[0]);
               this.items.push(this.items[1]);
               this.items.push(this.items[2]); // 将数组的第一个元素添加到数组的
               this.items=this.items.slice(3); 
               console.log(this.items)             //删除数组的第一个元素
               this.animate=false;  // margin-top 为0 的时候取消过渡动画，实现无缝滚动
       },1000)
    }
}
}
</script>

<style>
*{
    margin: 0 ;
    padding: 0;
}
.con1{
  margin-bottom: 20px;
}
.box{
    width: 300px;
    height: 96px;
    overflow: hidden;
    padding-left: 30px;
    border: 1px solid black;
}
.anim{
    transition: all 0.5s;
    margin-top: -96px;
    
}
.con1 li{
    list-style: none;
    line-height: 30px;
    height: 30px;
    border:1px solid red;
}
</style>
