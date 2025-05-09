
import { Bar } from "react-chartjs-2";
import { Categorywiseproject } from "./Categorywiseproject";
import { Valuewiseproject } from "./Valuewiseproject";
import { useState, useEffect } from "react";


export const ProjectBar = ({forbar,valueWise}) => {


  return (
    <div className="row  bg-white p-2 mx-1 mt-4 border rounded" >

      <div className="col-12 col-md-12">
         <Categorywiseproject categorywise={forbar}/>
      </div>

      <div className="col-12 col-md-12">

         <Valuewiseproject valueWise={valueWise}/>
      </div>
    

    </div>
  )
}