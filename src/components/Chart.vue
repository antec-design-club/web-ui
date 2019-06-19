<script>
  import { Bar, mixins } from 'vue-chartjs'
  const { reactiveProp } = mixins

  export default {
    extends: Bar,
    name: "Chart",
    mixins: [reactiveProp],
    props: ['options'],
    mounted () {
      this.renderChart(this.chartdata, this.options);
    }
  }
</script>

<style scoped>

</style>