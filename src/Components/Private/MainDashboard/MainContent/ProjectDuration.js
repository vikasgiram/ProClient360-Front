import { ProjectDurationBar } from "./ProjectDurationBar"



export const ProjectDuration = ({ duration }) => {



  return (
    <div className="row  bg-white p-2 mx-1 mt-4 border rounded" >
      <div className="col-12 col-md-12" >

        <ProjectDurationBar duration={duration} />
      </div>



    </div>
  )
}