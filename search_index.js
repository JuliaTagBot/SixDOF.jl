var documenterSearchIndex = {"docs":
[{"location":"guide/#Guide-1","page":"Guide","title":"Guide","text":"","category":"section"},{"location":"guide/#","page":"Guide","title":"Guide","text":"First, we import the module.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"using SixDOF","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"There are several structs we need to define.  The inputs used in this example correspond to the Zagi flying wing in Appendix E of Small Unmanned Aircraft: Theory and Practice by Beard and McLain.  We specify the mass properties:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"MassProp","category":"page"},{"location":"guide/#SixDOF.MassProp","page":"Guide","title":"SixDOF.MassProp","text":"MassProp(m, Ixx, Iyy, Izz, Ixz, Ixy, Iyz)\n\nMass and moments of inertia in the body frame. Ixx = int(y^2 + z^2, dm) Ixz = int(xz, dm)\n\nMost aircraft are symmetric about y and so there is a convenience method  to specify only the nonzero components. MassProp(m, Ixx, Iyy, Izz, Ixz)\n\n\n\n\n\n","category":"type"},{"location":"guide/#","page":"Guide","title":"Guide","text":"For this example:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"m = 1.56\nIxx = 0.1147\nIyy = 0.0576\nIzz = 0.1712\nIxz = 0.0015\nmp = MassProp(m, Ixx, Iyy, Izz, Ixz)\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Next, we specify reference areas and lengths:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Reference","category":"page"},{"location":"guide/#SixDOF.Reference","page":"Guide","title":"SixDOF.Reference","text":"Reference(S, b, c)\n\nThe reference area, span, and chord used in the aerodynamic computations.\n\n\n\n\n\n","category":"type"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Sref = 0.2589\nbref = 1.4224\ncref = 0.3302\nref = Reference(Sref, bref, cref)\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Control inputs need to be as follows:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Control","category":"page"},{"location":"guide/#SixDOF.Control","page":"Guide","title":"SixDOF.Control","text":"Control(de, dr, da, df, throttle)\n\nDefine the control settings: delta elevator, delta rudder, delta aileron,  delta flaps, and throttle.\n\n\n\n\n\n","category":"type"},{"location":"guide/#","page":"Guide","title":"Guide","text":"In this example, we don't use any control deflections.  Just throttle, at 80%.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"control = Control(0.0, 0.0, 0.0, 0.0, 0.8)\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Next, we define the atmospheric model.  AtmosphereModel is an abstract type that must define the following three methods.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"SixDOF.wind(::AtmosphereModel, ::Any)\nSixDOF.properties(::AtmosphereModel, state)\nSixDOF.gravity","category":"page"},{"location":"guide/#SixDOF.wind-Tuple{AtmosphereModel,Any}","page":"Guide","title":"SixDOF.wind","text":"wind(model::AtmosphereModel, state)\n\nCompute wind velocities.\n\nReturns\n\nWi: wind velocities in inertial frame\nWb: gust velocities in body frame (just a convenience to allow some velocities in body frame)\n\n\n\n\n\n","category":"method"},{"location":"guide/#SixDOF.properties-Tuple{AtmosphereModel,Any}","page":"Guide","title":"SixDOF.properties","text":"properties(model::AtmosphereModel, state)\n\nCompute atmospheric density and the speed of sound.\n\n\n\n\n\n","category":"method"},{"location":"guide/#SixDOF.gravity","page":"Guide","title":"SixDOF.gravity","text":"gravity(model::AtmosphereModel, state)\n\nCompute the local acceleration of gravity.\n\n\n\n\n\n","category":"function"},{"location":"guide/#","page":"Guide","title":"Guide","text":"There is a default implementation in the module, which is the simplest possible model: one with constant properties:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"ConstantAtmosphere","category":"page"},{"location":"guide/#SixDOF.ConstantAtmosphere","page":"Guide","title":"SixDOF.ConstantAtmosphere","text":"ConstantAtmosphere(Wi, Wb, rho, asound, g)\n\nConstant atmospheric properties.\n\n\n\n\n\n","category":"type"},{"location":"guide/#","page":"Guide","title":"Guide","text":"We use that in this example:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Wi = [0.0, 0.0, 0.0]\nWb = [0.0, 0.0, 0.0]\nrho = 1.2682\nasound = 300.0\ng = 9.81\natm = ConstantAtmosphere(Wi, Wb, rho, asound, g)\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Finally, we now need to define the forces and moments.  We provide three abstract types for three types of forces: aerodynamics, propulsion, and gravity.  In principle you could use these methods to define forces/moments for any application, but for aircraft this is a convenient separation.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"All three forces take in all the same inputs, which include everything discussed so far and the state.  The state is an internally used struct that contains the state of the aircraft (or other object).","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"SixDOF.State","category":"page"},{"location":"guide/#SixDOF.State","page":"Guide","title":"SixDOF.State","text":"State(x, y, z, phi, theta, psi, u, v, w, p, q, r)\n\nState of the aircraft: positions in inertial frame, euler angles, velocities in body frame, angular velocities in body frame.\n\n\n\n\n\n","category":"type"},{"location":"guide/#","page":"Guide","title":"Guide","text":"The AeroModel abstract type must define the following function:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"SixDOF.aeroforces(model::AeroModel, atm::AtmosphereModel, state::SixDOF.State, control::Control, mp::MassProp, ref::Reference)","category":"page"},{"location":"guide/#SixDOF.aeroforces-Tuple{AeroModel,AtmosphereModel,SixDOF.State,Control,MassProp,Reference}","page":"Guide","title":"SixDOF.aeroforces","text":"aeroforces(model::AeroModel, atm::AtmosphereModel, state::State, control::Control, mp::MassProp, ref::Reference)\n\nCompute the aerodynamic forces and moments in the body frame. return F, M\n\n\n\n\n\n","category":"method"},{"location":"guide/#","page":"Guide","title":"Guide","text":"The default implementation of AeroModel is one based on stability derivatives.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"StabilityDeriv","category":"page"},{"location":"guide/#SixDOF.StabilityDeriv","page":"Guide","title":"SixDOF.StabilityDeriv","text":"StabilityDeriv(CL0, CLalpha, CLq, CLM, CLdf, CLde, alphas, \n    CD0, U0, exp_Re, e, Mcc, CDdf, CDde, CDda, CDdr, \n    CYbeta, CYp, CYr, CYda, CYdr, Clbeta, \n    Clp, Clr, Clda, Cldr, \n    Cm0, Cmalpha, Cmq, CmM, Cmdf, Cmde, \n    Cnbeta, Cnp, Cnr, Cnda, Cndr)\n\nStability derivatives of the aircraft.  Most are self explanatory if you are familiar with stability derivatives (e.g., CLalpha is dCL/dalpha or the lift curve slope). Some less familiar ones include\n\nM: Mach number\nalphas: the angle of attack for stall\nU0: the speed for the reference Reynolds number CD0 was computed at\nexp_Re: the coefficient in the denominator of the skin friction coefficient (0.5 laminar, 0.2 turbulent)\ne: Oswald efficiency factor\nMcc: crest critical Mach number (when compressibility drag rise starts)\n\n\n\n\n\n","category":"type"},{"location":"guide/#","page":"Guide","title":"Guide","text":"We use the following values for this example.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"\nCL0 = 0.09167 # Zero-alpha lift\nCLalpha = 3.5016  # lift curve slope\nCLq = 2.8932 # Pitch rate derivative\nCLM = 0.0 # Mach derivative\nCLdf = 0.0  # flaps derivative\nCLde = 0.2724  # elevator derivative\nCLmax = 1.4  # max CL (stall)\nCLmin = -0.9  # min CL (neg stall)\nalphas = 20*pi/180\n\nCD0 = 0.01631  # zero-lift drag coerff\nU0 = 10.0  # velocity corresponding to Reynolds number of CD0\nexp_Re = -0.2  # exponent in Reynolds number calc\ne = 0.8  # Oswald efficiency\nMcc = 0.7  # crest critcal Mach number\nCDdf = 0.0  # flaps\nCDde = 0.3045  # elevator\nCDda = 0.0  # aileron\nCDdr = 0.0  # rudder\n\nCYbeta = -0.07359 # Sideslip derivative\nCYp = 0.0  # Roll rate derivative\nCYr = 0.0 # Yaw rate derivative\nCYda = 0.0 # Roll control (aileron) derivative\nCYdr = 0.0 # Yaw control (rudder) derivative\n\nClbeta = -0.02854  # Sideslip derivative\nClp = -0.3209  # Roll rate derivative\nClr = 0.03066  # Yaw rate derivative\nClda = 0.1682  # Roll (aileron) control derivative\nCldr = 0.0  #Yaw (rudder) control derivative\n\nCm0 = -0.02338 # Zero-alpha pitch\nCmalpha = -0.5675 # Alpha derivative\nCmq = -1.3990 # Pitch rate derivative\nCmM = 0.0\nCmdf = 0.0\nCmde = -0.3254 # Pitch control derivative\n\nCnbeta = -0.00040  # Slideslip derivative\nCnp = -0.01297  # Roll rate derivative\nCnr = -0.00434  # Yaw rate derivative\nCnda = -0.00328  # Roll (aileron) control derivative\nCndr = 0.0  # Yaw (rudder) control derivative\n\nsd = StabilityDeriv(CL0, CLalpha, CLq, CLM, CLdf, CLde, alphas,\n    CD0, U0, exp_Re, e, Mcc, CDdf, CDde, CDda, CDdr,\n    CYbeta, CYp, CYr, CYda, CYdr,\n    Clbeta, Clp, Clr, Clda, Cldr,\n    Cm0, Cmalpha, Cmq, CmM, Cmdf, Cmde,\n    Cnbeta, Cnp, Cnr, Cnda, Cndr)\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"The PropulsionModel abstract type must define the following function:","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"SixDOF.propulsionforces(model::PropulsionModel, atm::AtmosphereModel, state::SixDOF.State, control::Control, mp::MassProp, ref::Reference)","category":"page"},{"location":"guide/#SixDOF.propulsionforces-Tuple{PropulsionModel,AtmosphereModel,SixDOF.State,Control,MassProp,Reference}","page":"Guide","title":"SixDOF.propulsionforces","text":"propulsionforces(model::PropulsionModel, atm::AtmosphereModel, state::State, control::Control, mp::MassProp, ref::Reference)\n\nCompute the propulsive forces and moments in the body frame. return F, M\n\n\n\n\n\n","category":"method"},{"location":"guide/#","page":"Guide","title":"Guide","text":"The default implementation of PropulsionModel is based on a first-order motor model coupled with a parameterized curve fit of propeller data.  The torque for when the motor and propeller are matched is solved for and then used to compute thrust.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"MotorPropBatteryDataFit","category":"page"},{"location":"guide/#SixDOF.MotorPropBatteryDataFit","page":"Guide","title":"SixDOF.MotorPropBatteryDataFit","text":"MotorPropBatteryDataFit(CT2, CT1, CT0, CQ2, CQ1, CQ0, D, num, type,\n    R, Kv, i0, voltage)\n\nInputs\n\nCT2, CT1, CT0: quadratic fit to propeller thrust coefficient of form: CT = CT2J2 + CT1J + CT0\nCQ2, CQ1, CQ0: quadratic fit to propeller torque coefficient of form: CQ = CQ2J2 + CQ1J + CQ0\nD: propeller diameter\nnum: number of propellers\ntype: CO (torques add), COUNTER (torques add but with minus sign), COCOUNTER (no torque, they cancel out)\nR: motor resistance\nKv: motor Kv\ni0: motor no-load current\nvoltage: battery voltage\n\n\n\n\n\n","category":"type"},{"location":"guide/#","page":"Guide","title":"Guide","text":"This example uses data roughly corresponding to an APC thin electric 10x5","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"\nCT0 = 0.11221\nCT1 = -0.13803\nCT2 = -0.047394\nCQ0 = 0.0062\nCQ1 = 0.00314\nCQ2 = -0.015729\nD = 10*0.0254\nnum = 2\ntype = COCOUNTER\nR = 0.5\nKv = 2500.0 * pi/30\ni0 = 0.3\nvoltage = 8.0\npropulsion = MotorPropBatteryDataFit(CT2, CT1, CT0, CQ2, CQ1, CQ0, D, num, type, R, Kv, i0, voltage)\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"Finally, the InertialModel must implment the following function","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"SixDOF.gravityforces(model::InertialModel, atm::AtmosphereModel, state::SixDOF.State, control::Control, mp::MassProp, ref::Reference)","category":"page"},{"location":"guide/#SixDOF.gravityforces-Tuple{InertialModel,AtmosphereModel,SixDOF.State,Control,MassProp,Reference}","page":"Guide","title":"SixDOF.gravityforces","text":"gravityforces(model::InertialModel, atm::AtmosphereModel, state::State, control::Control, mp::MassProp, ref::Reference)\n\nCompute the gravitational forces and moments in the body frame. return F, M\n\n\n\n\n\n","category":"method"},{"location":"guide/#","page":"Guide","title":"Guide","text":"The default implementation (UniformGravitationalField) assumes that the center of mass and center of gravity are coincident and so there is no gravitational moment.  The default will likely be used most of the time as that condition is true for almost all applications, except perhaps some spacecraft in high orbits where small gravitational torques may matter.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"inertial = UniformGravitationalField()\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"The main function is ","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"sixdof!","category":"page"},{"location":"guide/#SixDOF.sixdof!","page":"Guide","title":"SixDOF.sixdof!","text":"sixdof!(ds, s, params, time)\n\ndynamic and kinematic ODEs.  Follows format used in DifferentialEquations package.\n\ns = x, y, z, phi, theta, psi, u, v, w, p, q, r (same order as State)\nparams = control, massproperties, reference, aeromodel, propmodel, inertialmodel, atmmodel\n\n\n\n\n\n","category":"function"},{"location":"guide/#","page":"Guide","title":"Guide","text":"We rarely use it directly, but rather use it in connection with an ODE solver.  In this case the DifferentialEquations package.  We start with an initial velocity at an angle of attack and simulate for four seconds.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"import DifferentialEquations\n\nVinf = U0\nalpha = 3.0*pi/180\ns0 = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, Vinf*cos(alpha), 0.0, Vinf*sin(alpha), 0.0, 0.0, 0.0]\ntspan = (0.0, 4.0)\np = control, mp, ref, sd, propulsion, inertial, atm\n\n\nprob = DifferentialEquations.ODEProblem(sixdof!, s0, tspan, p)\nsol = DifferentialEquations.solve(prob)\nnothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"We can plot the results.  For example the linear positions and velocities.  The y-components are not plotted in this case, because they are all zero as there are no control deflections or wind that would cause lateral motion in this example.","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"using PyPlot\n\nfigure()\nplot(sol.t, sol[1, :])\nxlabel(\"time (s)\")\nylabel(\"x inertial position (m)\")\nsavefig(\"x.svg\"); nothing # hide\nfigure()\nplot(sol.t, sol[3, :])\nxlabel(\"time (s)\")\nylabel(\"z inertial position (m)\")\nsavefig(\"z.svg\"); nothing # hide\nfigure()\nplot(sol.t, sol[7, :])\nxlabel(\"time (s)\")\nylabel(\"u body velocity (m/s)\")\nsavefig(\"u.svg\"); nothing # hide\nfigure()\nfigure()\nplot(sol.t, sol[9, :])\nxlabel(\"time (s)\")\nylabel(\"w body velocity (m/s)\")\nsavefig(\"w.svg\"); nothing # hide","category":"page"},{"location":"guide/#","page":"Guide","title":"Guide","text":"(Image: ) (Image: ) (Image: ) (Image: )","category":"page"},{"location":"theory/#Theory-1","page":"Theory","title":"Theory","text":"","category":"section"},{"location":"theory/#Introduction-1","page":"Theory","title":"Introduction","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"This nonlinear sixDOF model uses aircraft conventions as that is our target application.  Although the model is fairly general, some extensions may be needed for other applications (derivatives of moment of inertia tensor for morphing aircraft, quaternions and gravitational moments for spacecraft).","category":"page"},{"location":"theory/#State-and-Coordinate-Systems-1","page":"Theory","title":"State and Coordinate Systems","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Two main coordinate systems are used in this analysis as depicted below.  The first is the inertial frame (x_i y_i z_i), fixed to the ground [1], centered at some arbitrary reference point (sometimes this coordinate system is referred to as north-east-down).  The second is the body frame (x_b y_b z_b), fixed to the moving and rotating vehicle, centered at the vehicle's center of mass.  A third coordinate system will be introduced later in connection with aerodynamics.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"(Image: coordinate systems)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The aircraft has 12 state variables: the linear and angular positions and the linear and angular velocities.  ","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"s = x y z phi theta psi u v w p q r^T","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The positions are defined in the inertial frame, while the velocities are defined in the body frame.  The rotational velocities p q r correspond to roll, pitch, and yaw rates respectively.  ","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Although there are twelve state variables, there are only six indepedent degrees of freedom (hence the name SixDOF).  The other six constraints are purely kinematic relationships enforcing consistency between positions and velocities.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We define the angular orientation of the vehicle using Euler angles.  Euler angles are not unique. We use a typical representation with the following order from the inertial axis to the body axis:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"rotate psi radians about the inertial z-axis\nrotate theta radians about the new y-axis\nrotate phi radians about the new x-axis.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The resulting rotations will then align with the body axis.  The two coordinate systems will generally still differ by a translation.  For the calculations here, like transfering velocity vectors between the frames, the translation offset is irrelevant.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The resulting rotation matrix from inertial to body is (see Beard and McLain for derivation [2]:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"R_i rightarrow b = \nbeginbmatrix\ncosthetacospsi  costhetasinpsi  -sintheta \nsinphisinthetacospsi - cosphisinpsi  sinphisinthetasinpsi + cosphicospsi  sinphicostheta \ncosphisinthetacospsi + sinphisinpsi  cosphisinthetasinpsi - sinphicospsi  cosphicostheta\nendbmatrix","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"This matrix is orthogonal so its inverse is its transpose.  In other words the rotation matrix from body to inertial is the transpose of above:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"R_b rightarrow i = R_i rightarrow b^T","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The downside of Euler angles is that there is a singularity.  For this particular order that singularity occurs at a theta (associated with pitch) of pm 90^circ.  At that state, the yaw angle is not unique, a phenomenon known as gimbal lock.  The avoid this issue, quaternions are commonly used.  For spacecraft such pitch angles would be normal and thus this would be an important consideration.  For now, we are only simulating aircraft so the simplicity of Euler angles is justified.","category":"page"},{"location":"theory/#Kinematics-and-Dynamics-1","page":"Theory","title":"Kinematics and Dynamics","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We now need to compute derivatives of all state variables in order to formulate an ODE.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The first two relationships are simply kinematic relationships between positions and velocities.  The derivative of the vehicle's position (vecr_i = x y z^T) is just the vehicle's velocity (vecV_b = u v w^T).  However, position is defined in the inertial frame, whereas the velocity is given in the body frame.  Thus, a rotation matrix is needed.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"fracd vecr_idt = R_b rightarrow i vecV_b","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Next, we need the derivatives of the Euler angles.  The procedure is the same as above, except that the Euler angles are defined across four different coordinate systems consisting of the body frame, inertial frame, and two intermediate frames between those two (see above definition of Euler angles).  The details are just coordinate transformations, but are a bit tedious and so are not repeated here (see [2] for derivation).  The result is:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"beginbmatrix\ndotphi \ndottheta \ndotpsi \nendbmatrix\n=\nbeginbmatrix\n1  sinphitantheta  cosphitantheta \n0  cosphi  -sinphi \n0  sinphicostheta  cosphicostheta \nendbmatrix\nbeginbmatrix\np \nq \nr \nendbmatrix","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Now we need to resolve the dynamics. We start with the linear velocity: vecV_b = u v w^T.  We can apply Newton's second law to the motion of the vehicle as follows:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecF = m fracd vecVdt_i","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where the derivative is in an inertial frame.  Newton's laws are only applicable in an inertial frame of reference. If a reference frame b is rotating relative to an inertial frame i then the time derivative of any vector vecv can be described as:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"leftfracd vecvdtright_i + leftfracd vecvdtright_b + vecomega_bi times vecv","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where vecomega_bi is the rotation of reference frame b relative to i.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We transform Newton's law to the body frame using the relationship from above.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecF = m left( fracdvecVdt_b + vecomega_bi times vecV right)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We can evaluate these forces/velocities in any frame, but the most convenient will be the body frame:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecF_b = m left( fracdvecV_bdt_b + vecomega_b times vecV_b right)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Since the end goal is an ODE and so we solve for dV_bdt_b:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"fracd vecV_bdt_b = fracvecF_bm - vecomega_b times  vecV_b","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where vecomega_b = p q r^T.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We follow a similar procedure for the rotational motion.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"beginaligned\nvecM = fracdvecHdt_i\n = fracdvecHdt_b + vecomega_bi times vecH \n = fracdvecH_bdt_b + vecomega_b times vecH_b \nendaligned","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The angular momentum is given by:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"beginaligned\nvecH = I vecomega\nvecH_b = I_b vecomega_b\nendaligned","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where I_b is the moment of inertia tensor defined in the body axis.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"I = \nbeginbmatrix\nI_xx  -I_xy  -I_xz \n-I_xy  I_yy  -I_yz \n-I_zx  -I_zy  I_zz \nendbmatrix","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"(note the minus signs on the off-diagonal components).  The diagonal components of the tensor are given by:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"I_xx = int (y^2 + z^2) dm","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"and the off-diagonal components are given by:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"I_xy = int xy dm","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Most aircraft are symmetric about the y-axis and so typically I_xy = I_yz = 0.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We now plug the definition of the angular moment back into Newton's law.  Unless, the aircraft is able to morph, the inertia tensor is constant in the body frame and so the equation becomes:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecM_b = I_b fracdvecomega_bdt_b + vecomega_b times I_b vecomega_b","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We solve for the derivative of the angular velocity:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"fracdvecomega_bdt_b = I_b^-1 left(vecM_b - vecomega_b times I_b vecomega_b right)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Note, that although a matrix inverse was written, in numerical implementation a linear solve would be used rather than an explicit inversion.","category":"page"},{"location":"theory/#Forces/Moments-1","page":"Theory","title":"Forces/Moments","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The primary forces and moments on the aircraft are from aerodynamics, propulsion, and gravity.  The former two are outside the scope of the dynamics module, although simple default implementations will be discussed.  The latter is straightforward.  Gravity always acts about the vehicle's center of mass [3], and so cannot create any moments on the vehicle.  Based on our above derivation we need forces/moments to be specified in the body frame.","category":"page"},{"location":"theory/#Gravity-1","page":"Theory","title":"Gravity","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"In the inertial frame gravity is in the positive z direction (recall that positive z is down).  Thus we just need to apply a rotation to the body frame:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"F_g = R_i rightarrow b\nbeginbmatrix\n0 \n0 \nmg \nendbmatrix","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"For our choice of Euler angles we can write this out explicitly as:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"beginbmatrix\n-mg sintheta \nmg sinphicostheta \nmg cosphicostheta \nendbmatrix","category":"page"},{"location":"theory/#Aerodynamics-(General)-1","page":"Theory","title":"Aerodynamics (General)","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Aerodynamic behavior is relative to the local freestream V_infty.  The local freestream, is the negative of what is referred to as true airspeed, and the true airspeed is ground speed minus wind speed.  ","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecV_infty = -vecV_a = -(vecV_g - vecV_w)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Ground speed, in the body frame is vecV_g = vecV_b = u v w^T.  For convenience, we allow the user to define a portion of the wind in the inertial frame and a portion in the body frame if desired.  The former would typically be steady-state winds, and the latter would typically represent gusts.  While an aerodynamicist uses the freestream, we will use dynamics convention and use the vehicle's airspeed instead (just a change in sign):","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecV_a_b =  vecV_b - left( R_i rightarrow b vecV_wi + vecV_wbright)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Aerodynamics requires an additional coordinate system: the wind frame.  Actually, we need one more intermediate frame, the stability frame, which occurs between the body frame and the wind frame.  Again, we adopt dynamics convention (aerodynamics convention uses the opposite sign for the x and z axes).  These two coordinate systems are depicted below.  The top figure shows the stability frame.  It is rotated about the body y-axis axis by the angle of attack alpha.  The bottom two figures depict the wind axis.  It is rotated about the stability z-axis by the sideslip angle beta.  The coordinate transformation from wind to body axes (the direction we will usually go) is thus:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"beginbmatrix\ncosalpha cosbeta  -cosalpha sinbeta  -sinalpha \nsinbeta  cosbeta  0 \nsinalpha cosbeta  -sinalpha sinbeta  cosalpha \nendbmatrix","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"(and the transformation from body to wind axes is the transpose of this).","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"(Image: Stability and wind axes)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The airspeed vector in the wind axes is:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecV_a_w = (V_a 0 0)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"From the definitions, either using the figure, or the coordinate transformation we can see that the airspeed vector in the body frame is then:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"vecV_a_b = V_a \nbeginbmatrix\ncosalphacosbeta\nsinbeta \nsinalphacosbeta\nendbmatrix","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We see that the airspeed is the magnitude of this vector","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"V_a = vecV_a_b_2","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"If we call the components of the airspeed in the body frame as follows: vecV_a_b = u_a v_a w_w^T then the angle of attack and sideslip angles are given by:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"alpha = tan^-1left(fracw_au_aright)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"beta = sin^-1left(fracv_aV_aright)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"These calculations may also be visualized from the figure below.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"(Image: angle of attack and sideslip)","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Because we have used dynamic conventions, we need to be careful to translate the aerodynamic forces properly.  Lift, side force, and drag, would be defined with the following signs using the dynamics wind frame:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"F_aero_w = -D Y -L","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Notice that drag and lift are defined in opposite directions from the dynamics positive coordinate directions.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Aerodynamic moments are typically also defined in the stability or wind axes, and so would be defined as follows using the dynamics wind frame.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"M_aero_w = mathcalL M N","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where the moments are rolling, pitching, and yaw respectively. Note that the rolling moment and yawing moment do not require any sign changes as the aerodynamic directions follow the same as used in dynamics.","category":"page"},{"location":"theory/#Aerodynamics-(a-specific-implementation)-1","page":"Theory","title":"Aerodynamics (a specific implementation)","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Everything up to this point defines the 6DOF simulator.  The aerodynamics, propulsion, and other forces/moments if applicable, are specific to the model choice.  As a simple default a conventional ``linear'' aerodynamics model is included.  This model we use is actually not strictly linear, particuarly in the case of drag, which is fundamentally nonlinear.  Arguably, that addition is negliglbe as aircraft drag typically plays a negligible role in its dynamic behavior.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We define the aerodynamic forces and moments using stability derivatives and control derivatives. The control deflections include delta f delta e delta r delta a for flaps, elevator, rudder, and aileron respectively.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"For lift:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"C_L = C_L_0 + fracd C_Ldalphaalpha + fracd C_Ldq fracq c2 V_a + fracd C_LdMM + fracd C_Ld delta fdelta f + fracd C_Ld delta edelta e","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where Mach is the Mach number.  A maximum and minimum C_L is also enforced (a very crude approximation of stall) via C_L_max and C_L_min.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Drag is a combination of parasitic, induced, and compressibility drag.  The parasitic drag coefficient is proportional to a skin friction coefficient C_D_f, which is Reynolds number dependent.  For laminar flow (Blasisus solution):","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"C_D_f propto frac1sqrtRe","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"For turbulent flow no such analytic solution exists, various empirical relationships exists such as the Schlichting formula:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"C_D_f propto frac1Re^02","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"We assume that the kinematic viscosity does not change appreciably throughout the trajectory and so the Reynolds number scaling only changes with the flight speed.  We can then define the parasitic drag as:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"C_D_p = C_D_0 left(fracV_aV_refright)^-k","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where C_D_0 is the zero-lift drag coefficient, and the second term is the Reynolds number correction based on the reference speed V_ref (corresponding to the Reynolds number at which C_D_0 was computed at, and an exponent for the skin friction coefficnet: k = 05 for laminar and k = 02 for turbulent.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The induced drag is given by its standard definition:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"C_D_i = fracC_L^2pi AR e","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"where e is Oswald's efficiency factor, and the aspect ratio uses the reference dimensions of the aircraft (span and area).","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"Compressibility drag uses an simple empirical quartic drag rise after the crest-critical Mach number:","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"C_D_c = 20(M - M_cc)^4","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"The parasitic drag is the sum of these three components plus that from control deflections.  An absolute value must be used for the control parts as deflections in either direction would increase drag.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"C_D = C_D_p + C_D_i + C_D_c + leftfracd C_Dd delta fdelta fright + leftfracd C_Dd delta edelta eright + leftfracd C_Dd delta adelta aright + leftfracd C_Dd delta rdelta rright","category":"page"},{"location":"theory/#Propulsion-1","page":"Theory","title":"Propulsion","text":"","category":"section"},{"location":"theory/#","page":"Theory","title":"Theory","text":"TODO","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"[1]: The earth is not, strictly speaking, an inertial frame since it is rotating and so objects on the surface are accelerating.  However, for our applications including the inertial effect is negligible.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"[2]: Small Unmanned Aircraft: Theory and Practice, Randal W. Beard and Timothy W. McLain, Princeton University Press, 2012.","category":"page"},{"location":"theory/#","page":"Theory","title":"Theory","text":"[3]: Actually it acts about the center of gravity, but in practice these are the same.  The only time we'd see a noticeable difference is if the vehicle was extremely large, or if this was a satellite then the very small gravitational moments might be important in its dynamics.","category":"page"},{"location":"#SixDOF.jl-1","page":"SixDOF.jl","title":"SixDOF.jl","text":"","category":"section"},{"location":"#","page":"SixDOF.jl","title":"SixDOF.jl","text":"This documentation contains a guide walkthrough and theory derivation.","category":"page"}]
}
