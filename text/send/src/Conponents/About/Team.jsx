import './About.css'
import image from '../../Asset/Book study.jpg'

function Team() {
  return (
    <div>
      <div className="team">
        <div className="team-heading">
          <h2>Our Team</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam dolores ut eligendi reiciendis animi explicabo? Quibusdam nemo sapiente delectus 
            fugiat sunt tempore consequuntur rerum vel dolorem, consectetur, doloremque explicabo voluptate animi placeat incidunt
             iusto molestias, velit similique ab. Facere, nisi?</p>
        </div>
      </div>
      <div className="image-container">
        <div className="listed-host">
          <div className="hostOne">
            <img src= {image} alt="" />
            <h3>General manager</h3>
            <span>Durotoluwa Praise</span>
          </div>

          <div className="hostOne">
            <img src= {image} alt="" />
            <h3>Senior manager</h3>
            <span>Praise Crack Joe</span>
          </div>

          <div className="hostOne">
            <img src= {image} alt="" />
            <h3>Assistant manager</h3>
            <span>Lorem ipsum dolor</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Team