const SalesDashboardCards = ({allEnquiriesServiceCount, winServiceCount, ongoingServiceCount, lostServiceCount, pendingFollowUpServiceCount, todayServiceCount }) => {
  return (
    <div className="row bg-white p-2 m-1 border rounded">
      <div className="col-12 py-1">
        <div className="row pt-3">
          
           <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style bg_sky">
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    All Enquiries
                  </h6>
                  <h2 className="pt-2 fw-bold card_count demo_bottom">
                    {allEnquiriesServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/planning.png" className="img_opacity all_card_img_size" alt="img not found" />
                </div>
              </div>
            </div>
          </div>

          
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor:"#FFEB3B"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Ongoing
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {ongoingServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/process.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>

           
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style"   style={{backgroundColor:"#FEA2A2"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Not Fisible
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {todayServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/stuck.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>


          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style"   style={{backgroundColor:"#E5F5E5"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Win
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {winServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/winner.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>


          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style"   style={{backgroundColor:"#E0E0E0"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Lost
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {lostServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/lost.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>
           

           <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style"   style={{backgroundColor:"#FFF9C4"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Today
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {todayServiceCount}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img src="./static/assets/img/only-today.png" className="img_opacity all_card_img_size" alt="" />
                </div>
              </div>
            </div>
          </div>
        
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor: '#f8d7da'}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Pending followUp
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {pendingFollowUpServiceCount}
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

export default SalesDashboardCards;

