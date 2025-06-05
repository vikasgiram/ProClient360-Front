const ServiceDashboardCards = ({totalServiceCount, inprogressServiceCount, pendingServiceCount, stuckServiceCount }) => {
  return (
    <div className="row bg-white p-2 m-1 border rounded">
      <div className="col-12 py-1">
        <div className="row pt-3">
        
           <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style bg_sky">
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Total Services
                  </h6>
                  <h2 className="pt-2 fw-bold card_count demo_bottom">
                    {totalServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/planning.png" className="img_opacity all_card_img_size" alt="img not found" />
                </div>
              </div>
            </div>
          </div> 
     

          
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style pinkcolor">
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Inprogress Services
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {inprogressServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/Inprocess.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>

           
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style"   style={{backgroundColor:"#FEA2A2"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Stuck Services
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {stuckServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/stuck.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>

        
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor: '#f8d7da'}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Pending Services
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {pendingServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/pending.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDashboardCards;

