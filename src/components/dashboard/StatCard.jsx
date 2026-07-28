// import "bootstrap-icons/font/bootstrap-icons.css";

function StatCard({ title, value, icon, color }) {
  return (
    <>
      <style>{`
        .stat-card{
          background:#fff;
          border-radius:12px;
          padding:18px;
          height:110px;
          display:flex;
          align-items:center;
          box-shadow:0 4px 12px rgba(0,0,0,.08);
          transition:.3s;
          border-left:6px solid transparent;
        }

        .stat-card:hover{
          transform:translateY(-4px);
          box-shadow:0 8px 20px rgba(0,0,0,.12);
        }

        .stat-card-content{
          width:100%;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .stat-card-left{
          display:flex;
          flex-direction:column;
        }

        .stat-title{
          margin:0;
          color:#6c757d;
          font-size:14px;
          font-weight:500;
        }

        .stat-value{
          margin:8px 0 0;
          font-size:28px;
          font-weight:700;
          color:#212529;
        }

        .stat-icon{
          width:55px;
          height:55px;
          border-radius:50%;
          display:flex;
          justify-content:center;
          align-items:center;
          color:#fff;
          font-size:24px;
        }

        .border-primary{border-left-color:#0d6efd;}
        .border-success{border-left-color:#198754;}
        .border-warning{border-left-color:#ffc107;}
        .border-danger{border-left-color:#dc3545;}

        .bg-primary{background:#0d6efd;}
        .bg-success{background:#198754;}
        .bg-warning{
          background:#ffc107;
          color:#222;
        }
        .bg-danger{background:#dc3545;}

        @media(max-width:768px){
          .stat-card{
            height:95px;
            padding:15px;
          }

          .stat-value{
            font-size:22px;
          }

          .stat-icon{
            width:45px;
            height:45px;
            font-size:20px;
          }
        }
      `}</style>

      <div className={`stat-card border-${color}`}>
        <div className="stat-card-content">
          <div className="stat-card-left">
            <p className="stat-title">{title}</p>
            <h3 className="stat-value">{value}</h3>
          </div>

          <div className={`stat-icon bg-${color}`}>
            <i className={icon}></i>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatCard;