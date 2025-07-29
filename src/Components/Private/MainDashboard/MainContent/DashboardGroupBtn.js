export const DashboardGroupBtn = ({custCount}) => {
    return (

        <div className="row p-2   ">
            <div className="col-12 col-lg-6">
                <h5 className="text-white fw-bold py-2">
                Dashboard
                </h5>
            </div>

            <div className="col-12 col-lg-6 ms-auto">
             <div className="d-flex align-items-center justify-content-end">
              <img src="static/assets/img/people.png"  className="customer_img" alt="logo"/>
               <span className="Customer_fs ps-3 text-white"> Customer |
                 <span className="Customer_count ms-2">{custCount}
               </span>
             </span> 
          </div> 
        </div>
     </div>
    )
}