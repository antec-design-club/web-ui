<template>
  <div class="container-fluid">
    <div class="row">
      <navigation></navigation>

      <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">Dashboard</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group mr-2">
              <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
              <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
              <span data-feather="calendar"></span>
              This week
            </button>
          </div>
        </div>

        <chart :chart-data="datacollection" :width="chartWidth" :height="chartHeight"></chart>

        <h2>Raw Data</h2>
        <div class="table-responsive">
          <table class="table table-striped table-sm">
            <thead>
            <tr>
              <th>Time</th>
              <th>Value</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in rawData">
              <td>{{ data.label }}</td>
              <td>{{ data.value }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Chart from './components/Chart'
import Navigation from './components/Navigation';

import { settings } from "./variables";

var mqtt = require("mqtt");
var client  = mqtt.connect(settings.mqttServer);

export default {
  name: 'app',
  components: {
    Navigation,
    Chart
  },
  data () {
    return {
      datacollection: null,
      chartWidth: 900,
      chartHeight: 250,
      dataLabels: [],
      dataSet: [],
      rawData: [],
    }
  },
  mounted () {
    client.on('connect', function () {
      client.subscribe(settings.flowSensorValueTopic, function (err) {
        if (!err) {
          // eslint-disable-next-line
          console.log("subscribed");
        }
      }.bind(this))
    }.bind(this));

    client.on('message', function (topic, message) {
      // message is Buffer
      // eslint-disable-next-line
      console.log("got message", topic, message);

      if (topic == settings.flowSensorValueTopic) {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        this.dataLabels.push(time);
        this.dataSet.push(parseInt(message.toString()));

        if (this.dataLabels.length > settings.numberOfReadingsToDisplay) {
          this.dataLabels = this.dataLabels.splice(this.dataLabels.length - settings.numberOfReadingsToDisplay);
          this.dataSet = this.dataSet.splice(this.dataSet.length - settings.numberOfReadingsToDisplay);
        }

        this.datacollection = {
          labels: this.dataLabels,
          datasets: [
            {
              label: 'Sensor Data',
              backgroundColor: '#f87979',
              data: this.dataSet
            },
          ]
        };

        this.rawData = [];
        for (var i = this.dataLabels.length - 1; i >= 0; i--) {
          this.rawData.push({
            label: this.dataLabels[i],
            value: this.dataSet[i]
          });
        }
      }
    }.bind(this));
  },
  methods: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
