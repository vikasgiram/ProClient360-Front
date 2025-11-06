import React from 'react';

const SalesDashboardCards = ({ 
  allLeadsCount, 
  ongogingCount, // Keep this as is to match the backend response
  winCount, 
  pendingCount, 
  lostCount, 
  todayCount,
  hotleadsCount 
}) => {
  return (
    <div className="row bg-white p-2 m-1 border rounded">
      <div className="col-12 py-1">
        <div className="row pt-3">
          
          {/* All Enquiries Card */}
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style bg_sky">
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    All Enquiries
                  </h6>
                  <h2 className="pt-2 fw-bold card_count demo_bottom">
                    {allLeadsCount || 0}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img 
                    src="./static/assets/img/planning.png" 
                    className="img_opacity all_card_img_size" 
                    alt="All Enquiries" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Card */}
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor:"#F8EFDE"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Ongoing
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {ongogingCount || 0}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img 
                    src="./static/assets/img/process.png" 
                    className="img_opacity all_card_img_size" 
                    alt="Ongoing" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Won Card */}
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor:"#E5F5E5"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Won
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {winCount || 0}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img 
                    src="./static/assets/img/winner.png" 
                    className="img_opacity all_card_img_size" 
                    alt="Won" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lost Card */}
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor:"#E0E0E0"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Lost
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {lostCount || 0}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img 
                    src="./static/assets/img/lost.png" 
                    className="img_opacity all_card_img_size" 
                    alt="Lost" 
                  />
                </div>
              </div>
            </div>
          </div>
        
          {/* Pending FollowUp Card */}
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor: '#f8d7da'}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Pending FollowUp
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {pendingCount || 0}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img 
                    src="./static/assets/img/pending.png" 
                    className="img_opacity all_card_img_size" 
                    alt="Pending" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Today's FollowUp Card */}
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor:"#FAFAD2"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Today's FollowUp
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {todayCount || 0}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img 
                    src="./static/assets/img/only-today.png" 
                    className="img_opacity all_card_img_size" 
                    alt="Today's FollowUp" 
                  />
                </div>
              </div>
            </div>
          </div>

        
          {/* Hot Leads Card */}
          <div className="col-12 col-md-3 pb-3 cursor-pointer">
            <div className="p-4 background_style" style={{backgroundColor:"#FFBF77"}}>
              <div className="row">
                <div className="col-9">
                  <h6 className="text-dark card_heading">
                    Hot Leads 
                  </h6>
                  <h2 className="pt-2 fw-bold card_count">
                    {hotleadsCount || 0}
                  </h2>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-center">
                  <img 
                    src="./static/assets/img/hoticon.png" 
                    className="img_opacity all_card_img_size" 
                    alt="Hot Leads" 
                  />
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