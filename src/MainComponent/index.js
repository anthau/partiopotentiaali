/*
 * Tekijä: Antto Hautamäki
 */

import React from 'react';
import { Component } from 'react';
import Popup from "reactjs-popup";
import '../App.css'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
let draw = true;
let map = L.map('mapid');
const HeatmapOverlay = require('leaflet-heatmap');

class MainComponent extends Component {
    count = 0;
   
    //reads the file
    handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileEncoding = 'UTF-8';
        const files = e.target.files;
        const coordinates1 = [];
        let reader = new FileReader()

        reader.onload = (_event: Event) => {
            const lines = reader.result.split("\n");
            lines.forEach(row => {

                const items = row.split(";");
                coordinates1.push(
                    {
                        code: items[0],
                        lat: parseFloat(items[1].replace(",", ".")),
                        lng: parseFloat(items[2].replace(",", ".")),
                        count: parseFloat(items[4]),
                        per: parseFloat(items[3].replace(",", "."))
                    }
                )


            });

            this.setState({
                coordinates: coordinates1
            })

            this.state.map.off();
            this.state.map.remove();
            this.drawMap(this,false);
        }
        
        reader.readAsText(files[0], fileEncoding);
    }

    constructor(props) {
        super(props);
       
            this.state = {
                circles: [],
                radius: 1000,
                map: null,
                mode: '1',
                L: null,
                per: 6,
                redraw: null,
                data: []

            };
    
        this.drawMap(this);

    }

    drawMap(t1) {
        //this try catch prevents the annoying  map already initialized-bug!
        if (draw) {
            draw = false;

            async function test() {
                let new1 = await fetch('test1.txt')
                    .then((r) => r.text())
                    .then(text => {
                        return text;

                    })


                let mymap = map.setView([60, 25], 5);

                let cfg = {
                    "radius": 0.03,
                    "maxOpacity": 0.4,
                    "maxZoom": 15,
                    "scaleRadius": true,
                    "useLocalExtrema": true,
                    latField: 'lat',
                    lngField: 'lon',
                    valueField: 'count',
                    gradient: { 0: "#000000", 0.1: "#370000", 0.2: "#570000", 0.3: "#770000", 0.4: "#ff0000", 0.6: "#ffc800", 0.8: "#ffff00", 1: "#FFFFFF" }

                };


                let heatmapLayer = new HeatmapOverlay(cfg);

                var heat = L.layerGroup(heatmapLayer);
           
             


                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                    zoom: 17,
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                     layers: [ heatmapLayer]
                }).addTo(mymap);

                let rows = new1.split("\n");
     
                //troopNames
                if (t1.state.mode === '2')   {
                    let potData = await fetch('testData11.txt')
                        .then((r) => r.text())
                        .then(text => {
                            return text;
                        });
           
                    const datalines = potData.split("\n");
                    const addMarkerHeat = (line) => {                     
                        const lineItems = line.split(";")
                        L.marker([parseFloat(lineItems[1].replace(",", ".")), parseFloat(lineItems[2].replace(",", "."))]) //.addTo(mymap)
                    }

                    datalines.forEach(line => addMarkerHeat(line))

                    const addCircle = (line) => {
                        const lineItems = line.split(";")
                        L.circle([parseFloat(lineItems[7]), parseFloat(lineItems[8])], {
                            color: "green",
                            fillColor: "blue",
                            fillOpacity: 0.09,
                            radius: t1.state.radius
                        }).addTo(mymap);
                    }

                    rows.forEach(line => addCircle(line))

                    let testData = {
                        max: 8,                        
                        data: [{ lat: 60.6408, lon: 24.7728, count: 3 }]

                    };

                    heatmapLayer.setData(testData);
                    heatmapLayer.addTo(mymap)



                }

                else {
                    const addCircle = (line) => {
                        const lineItems = line.split(";")
                        L.circle([parseFloat(lineItems[7]), parseFloat(lineItems[8])], {
                            color: "blue",
                            fillColor: "blue",
                            fillOpacity: 0.09,
                            radius: t1.state.radius
                        }).bindPopup(lineItems[0]).addTo(mymap);
                    }
                    rows.forEach(line => addCircle(line))
                }
            }
            test();
        }
    }

    detailRadius(e) {
        draw = true;
        map.off();
        map.remove();
        map = L.map('mapid')
        this.setState({ radius: e.target.value })
        this.drawMap(this);  
    }

    detailPer(e) {
        /*
        this.count++;
        this.state.map.off();
        this.state.map.remove();
        this.setState({ per: e.target.value })
        this.drawMap(this, false);
    */
    }

    /*
    update(e) {
        L.map.off();
        this.setState({ radius: 500 })
        this.drawMap(this);
    }
    */

    update1(e) {
        draw = true;
        map.off();
        map.remove();
        map = L.map('mapid')
        this.setState({ mode: e.target.value })
        this.drawMap(this);  
    }

    render() {
   
        //uudelleenpiirto sitten kun kaikki arvot on luettu
      
        if (this.state.redraw === false)
            return (<p>loading</p>)
        return (
            <div style={{ position: "fixed", top: -10, zIndex:1000 }} >
                    <h1>Partiopotentiaali  {this.state.data}</h1>
                    {this.state.mode === '2' ?
                        <input
                        type="file"
                        onChange={this.handleChangeFile.bind(this)}
                    />  : <></>}
                <br />
                    <input type="radio" name="choice" value="1" onChange={this.update1.bind(this)} defaultChecked={this.state.mode === '1'} /> <label>Kolon nimet n&auml;kyviss&auml;</label>     <br />
                    <input type="radio" name="choice" value="2" onChange={this.update1.bind(this)} defaultChecked={this.state.mode === '2'} /> <label>V&auml;est&ouml;(lapset) n&auml;kyviss&auml; </label>&#9;

                    <Popup style={{ position: "fixed", top: -10 }} trigger={<button>  Kartan asetukset</button>} position="right center">
                        <div >

                            <p><label> <b>et&auml;isyys kolosta  {this.state.radius}</b></label><label><br />10</label><input type="range" onChange={this.detailRadius.bind(this)} id="quantity223" name="quantity2233" min="10" max="3000" defaultValue="1000" /><label>3000</label>
                            </p>

                            <p><label> <b>partioprosentti  {this.state.per}</b></label><label><br />1</label><input type="range" onChange={this.detailPer.bind(this)} id="quantity2213" name="quantity22313" defaultValue="6" min="3" max="30" /><label>16</label>
                            </p>
                            <br />
                        <br />
                        </div>
                    </Popup>
                </div>
            )

        
    }
}
export default MainComponent;