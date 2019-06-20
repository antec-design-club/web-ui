<script>
  import { Line, mixins } from 'vue-chartjs'
  const { reactiveProp } = mixins

  export default {
    extends: Line,
    name: "Chart",
    mixins: [reactiveProp],
    //props: ['options'],
    data: () => ({
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }),
    mqtt: {
      '/my/test/topic': function (val) {
        // eslint-disable-next-line
        console.log('hello', val);
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options);
      this.$mqtt.subscribe('/my/test/topic', {}, function (err, granted) {
        // eslint-disable-next-line
        console.log('yup', err, granted);
      });
    }
  }
</script>

<style scoped>

</style>