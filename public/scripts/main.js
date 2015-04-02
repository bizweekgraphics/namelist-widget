// Mathbox bundles an outdated version of Underscore, unfortunately
var __ = _.noConflict();

var τ = Math.PI*2;

// global economic variables

var savingsRate = 0.4,
    invariantExpenditure = 0.3,
    interestRateCoefficient = -0.2;

// var dimensions[4] = {val:0.4};

var moneyInterestLinearIntercept = 0.6,
    moneyInterestLinearCoefficient = 0.4,
    moneyInterestNonlinearIntercept = 0.1,
    moneyInterestNonlinearCoefficient = 0.3;

var dimensions = [
  {
    "name": "Income",
    "color": "#ff0000",
    "description": "",
    "value": null,
    "axis": 0,
    "slidesParameter": [],
    "slidesVariable": [0,1,2,3,4,5,6,7]
  },
  {
    "name": "Aggregate expenditure",
    "color": "#ff0000",
    "description": "",
    "value": null,
    "axis": 1,
    "slidesParameter": [],
    "slidesVariable": [0,1,2,3,4,5,6,7]
  },
  {
    "name": "Money balance",
    "color": "#ff0000",
    "description": "",
    "value": null,
    "axis": 1,
    "slidesParameter": [],
    "slidesVariable": []
  },
  {
    "name": "Interest rate",
    "color": "#ff0000",
    "description": "",
    "value": null,
    "axis": 2,
    "slidesParameter": [],
    "slidesVariable": [0,1,2,3,4,5,6,7]
  },
  {
    "name": "Savings rate",
    "color": "#ffffff",
    "description": "",
    "value": 0.4,
    "axis": null,
    "slidesParameter": [1,2,3],
    "slidesVariable": []
  }
];

var expenditure = function(scale,
                           savingsRate,
                           interestRateCoefficient,
                           invariantExpenditure,
                           income,
                           interestRate) {

  return [ scale[0] * income,
           scale[1] * ((1 - savingsRate.value) * income +
                       interestRateCoefficient * interestRate +
                       invariantExpenditure),
           scale[2] * interestRate,
         ];

};

var expend3D = __.partial(expenditure,
                            [1,1,1],
                            dimensions[4],
                            interestRateCoefficient,
                            invariantExpenditure,
                            __,
                            __);

var expend2D = __.partial(expenditure,
                            [1,1,0],
                            __,
                            interestRateCoefficient,
                            __,
                            __,
                            __);

var investmentSaving = function(scale,
                             invariantExpenditure,
                             interestRateCoefficient,
                             interestRate,
                             savingsRate) {

  var eq = (invariantExpenditure +
            interestRateCoefficient * interestRate)
            / savingsRate.value;

  return [scale[0] * eq,
          scale[1] * eq,
          scale[2] * interestRate];

};

var IS3D = __.partial(investmentSaving,
                      [1,1,1],
                      invariantExpenditure,
                      interestRateCoefficient,
                      __,
                      dimensions[4]);

var IS2D = __.partial(investmentSaving,
                      [1,0,1],
                      invariantExpenditure,
                      interestRateCoefficient,
                      __,
                      dimensions[4]);

var moneyInterestEq = function(scale,
                               intercept,
                               coefficient,
                               moneyBalance,
                               income ) {

  // hangin on to a couple options for the key bit...
  linearEq = ((intercept + coefficient * income*income) - moneyBalance);
  nonlinearEq = ((0.3*income*income+0.1) / moneyBalance);

  return [
    scale[0] * income,
    scale[1] * moneyBalance,
    scale[2] * nonlinearEq
  ];

};

var moneyInterest3D = __.partial(moneyInterestEq, [1,1,1], moneyInterestNonlinearIntercept, moneyInterestNonlinearCoefficient, __, __);

var moneyInterest2D = __.partial(moneyInterestEq, [0,1,1], moneyInterestNonlinearIntercept, moneyInterestNonlinearCoefficient, __, __);

var LMline = __.partial(moneyInterest3D, 0.5, __);

function mathboxSetup() {
  // Viewport camera/setup
  mathbox
    // Cartesian viewport
    .viewport({
      type: 'cartesian',
      range: [[0, 1], [0, 1], [0, 1]],
      scale: [1, 1, .001],
    })
    .camera({
      orbit: 5,
      phi: τ/4,
      theta: 0,
    })
    .transition(300)
}

var mathboxScript = [
  // show first point
  [
    ['add', 'curve', {
      id: 'spending-point',
      n: 1,
      points: true,
      pointSize: 10,
      line: false,
      expression: function(x) { return [0, 0.5]; },
      color: 0x000000,
      zIndex: 1,
    }, {
      delay: 0,
      duration: 500
    }]
  ],
  // move point into position
  [
    ['animate', '#spending-point', {
      expression: function(x) { return [0.5, 0.5]; }
    }, {
      delay: 0,
      duration: 500
    }]
  ],
  // replace point with y=x line
  [
    ['remove', '#spending-point'],
    ['add', 'curve', {
      id: 'income-expenditure-identity',
      expression: __.partial(expend2D, {value:0}, 0, __, 0),
      color: 0x000000,
      zIndex: 1,
    }, {
      delay: 0,
      duration: 500
    }],
  ],
  // discount line to show savings
  [
    ['clone', '#income-expenditure-identity', {
      id: 'aggregate-expenditure',
      expression: __.partial(expend2D, dimensions[4], 0, __, 0),
    }, {
      delay: 0,
      duration: 500
    }]
  ],
  // shift line up to show invariant expenditure
  [
    ['animate', '#aggregate-expenditure', {
      expression: __.partial(expend2D, dimensions[4], invariantExpenditure, __, 0),
    }, {
      delay: 0,
      duration: 500
    }],
  ],

  // show equilibrium points
  [
    ['add', 'curve', {
      id: 'intersection-point',
      n: 1,
      points: true,
      pointSize: 10,
      line: false,
      expression: __.partial(IS3D, 0),
      color: 0xff00ff,
      zIndex: 3,
    }, {
      delay: 0,
      duration: 500
    }],

    ['animate', '#eq-label', {opacity: 1}, {duration: 500}],

  ],

  // shift line down to show lower invariant expenditure under higher interest rate
  [
    ['clone', '#aggregate-expenditure', {
      id: 'aggregate-expenditure-low',
      expression: __.partial(expend2D, dimensions[4], invariantExpenditure, __, 1),
    }, {
      delay: 0,
      duration: 500
    }],
    ['clone', '#intersection-point', {
      id: 'intersection-point-2',
      expression: __.partial(IS3D, 1),
    }, {
      delay: 0,
      duration: 500
    }],
    ['animate', '#eq-label', {opacity: 0}, {duration: 500}],
    ['animate', '#eq-label-1', {opacity: 1}, {duration: 500}],
    ['animate', '#eq-label-2', {opacity: 1}, {duration: 500}],
  ],

  // ESCAPE FROM FLATLAND
  [
    ['animate', 'viewport', {
      scale: [1, 1, 1],
      rotation: [0,-τ/32,0]
    }, {
      duration: 1500,
    }],
    // zoom out a bit
    ['animate', 'camera', {
      orbit: 5,
    }, {
      duration: 1500,
    }],

    ['animate', '#z-axis', { opacity: 1 }, { duration: 1500 }],
    ['animate', '#xz-plane', { opacity: 0.5 }, { duration: 1500 }],
    ['animate', '#yz-plane', { opacity: 0.5 }, { duration: 1500 }],

    ['animate', '#z-label', {opacity: 1}, {duration: 1500}],

    ['remove', '#intersection-point, #intersection-point-2', { duration: 1500 }],

    ['add', 'surface', {
      id: 'income-expenditure-identity-plane',
      expression: function(x, y) { return x; },
      color: 0x000000,
      zIndex: 1,
      opacity: 0.5,
    }, {
      delay: 0,
      duration: 1500
    }],
    ['add', 'surface', {
      id: 'aggregate-expenditure-plane',
      expression: expend3D,
      color: 0x000000,
      zIndex: 2,
      opacity: 0.5,
    }, {
      delay: 0,
      duration: 1500
    }],
    ['add', 'curve', {
      id: 'is-line',
      expression: IS3D,
      color: 0xff00ff,
      zIndex: 4,
    }, {
      duration: 500
    }],
    ['animate', '#aggregate-expenditure-low', {
      expression: __.partial(expend3D, __, 1),
    }, {
      duration: 250,
      delay: 0
    }],
    ['remove', '#income-expenditure-identity', { duration: 500, delay: 1000 }],
    ['remove', '#aggregate-expenditure', { duration: 500, delay: 1000 }],
    ['remove', '#aggregate-expenditure-low', { duration: 500, delay: 1000 }],

  ],

  // PROJECTING THE IS LINE
  [
    // reset camera
    ['animate', 'camera', {
      phi: τ/4,
      theta: 0,
    }, {
      duration: 1500,
    }],
    // rotate viewport
    ['animate', 'viewport', {
      rotation: [-τ/4,0,0]
    }, {
      duration: 1500,
    }],
    // collapse expenditures
    ['animate', 'viewport', {
      scale: [1, .001, 1],
    }, {
      duration: 1500,
      delay: 1000
    }],
    // hide planes
    ['animate', '#income-expenditure-identity-plane', {
      opacity: 0,
    }, {
      duration: 1500,
      delay: 1000
    }],
    ['animate', '#aggregate-expenditure-plane', {
      opacity: 0,
    }, {
      duration: 1500,
      delay: 1000
    }],
    // project intersection onto xz plane
    ['animate', '#is-line', {
      expression: IS2D
    }, {
      duration: 0,
      delay: 2500
    }],
    // hide axes
    ['animate', '#y-axis', { opacity: 0 }, { duration: 1500, delay: 1000 }],
    ['animate', '#xy-plane', { opacity: 0 }, { duration: 1500, delay: 1000 }],
    ['animate', '#yz-plane', { opacity: 0 }, { duration: 1500, delay: 1000 }],

    ['animate', '#y-label', {opacity: 0}, {duration: 1500}],
    ['animate', '#eq-label-1', {opacity: 0}, {duration: 1500}],
    ['animate', '#eq-label-2', {opacity: 0}, {duration: 1500}],
  ],

  // LM
  [
    // hide income
    ['animate', '#is-line', { opacity: 0 }, { duration: 1500 }],
    ['animate', '#x-axis', { opacity: 0 }, { duration: 1500 }],
    ['animate', '#xz-plane', { opacity: 0 }, { duration: 1500 }],

    // show expenditure, now doubling as "money supply"
    ['animate', '#y2-axis', { opacity: 1 }, { duration: 1500 }],
    ['animate', '#yz-plane', { opacity: 0.5 }, { duration: 1500 }],

    // rotate viewport, reset camera
    ['animate', 'viewport', {
      rotation: [-τ/4, 0, -τ/4],
      scale: [.001, 1, 1],
    }, {
      duration: 1500,
    }],
    ['animate', 'camera', {
      phi: τ/4,
      theta: 0,
    }, {
      duration: 1500,
    }],
  ],
  // show money-interest curve
  [
    ['add', 'surface', {
      id: 'money-interest-plane',
      color: 0x000000,
      zIndex: 2,
      opacity: 0,
      domain: [[0,1], [0,0]],
      expression: moneyInterest3D,
    }],
    ['add', 'curve', {
      id: 'money-interest',
      color: 0x000000,
      zIndex: 1,
      expression: __.partial(moneyInterest2D, __, 0),
    }, { duration: 500 }],
  ],
  // show money balance & equilibrium
  [
    ['add', 'surface', {
      id: 'money-balance-surface',
      expression: function(x,y) { return [y,.5,x]; },
      zIndex: 1,
      opacity: 0,
      domain: [[0,1], [0,0]],
    }],
    ['add', 'curve', {
      id: 'money-balance',
      expression: function(x) { return [0,.5,x]; },
      color: 0x000000,
      zIndex: 1,
    }, {
      duration: 500
    }],
    ['add', 'curve', {
      id: 'money-interest-intersection',
      n: 1,
      points: true,
      pointSize: 10,
      line: false,
      expression: __.partial(LMline, 0),
      color: 0xff00ff,
      zIndex: 3,
    }, {
      duration: 500
    }],
    ['add', 'curve', {
      id: 'lm-line',
      color: 0xff00ff,
      zIndex: 4,
      opacity: 0,
      domain: [0,0],
      expression: LMline,
    }],
  ],
  // show higher money balance curve
  [
    ['clone', '#money-interest', {
      id: 'money-interest-2',
      expression: __.partial(moneyInterest2D, __, 0.5),
    }, { duration: 500 }],
    ['clone', '#money-interest-intersection', {
      id: 'money-interest-intersection-2',
      expression: __.partial(LMline, 0.5),
    }, { duration: 500 }],
  ],
  // show less-higher money balance curve
  [
    ['clone', '#money-interest-2', {
      id: 'money-interest-3',
      expression: __.partial(moneyInterest2D, __, 1),
    }],
    ['clone', '#money-interest-intersection-2', {
      id: 'money-interest-intersection-3',
      expression: __.partial(LMline, 1),
    }],
  ],

  // ESCAPE FROM FLATLAND pt.2
  [
    // show
    ['animate', '#x-axis', { opacity: 1 }, { duration: 1500 }],
    ['animate', '#xy-plane', { opacity: 0.5 }, { duration: 1500 }],
    ['animate', '#xz-plane', { opacity: 0.5 }, { duration: 1500 }],
    // rotate viewport
    ['animate', 'viewport', {
      rotation: [-τ/4, 0, -τ/4-τ/8],
      scale: [1, 1, 1],
    }, {
      duration: 1500,
    }],
    // build out surface from lines
    ['animate', '#money-interest-2', { expression: __.partial(moneyInterest3D, __, 0.5) }],
    ['animate', '#money-interest-3', { expression: __.partial(moneyInterest3D, __,   1) }],
    // reveal surfaces
    ['animate', '#money-interest-plane', {
      opacity: 0.5,
      domain: [[0,1], [0,1]],
    }, {
      delay: 500,
      duration: 1500,
    }],
    ['animate', '#money-balance-surface', {
      opacity: 0.5,
      domain: [[0,1], [0,1]],
    }, {
      delay: 1000,
      duration: 1500,
    }],
    // draw intersection
    ['animate', '#lm-line', {
      opacity: 1,
      domain: [0,1],
    }, {
      delay: 1000,
      duration: 1500,
    }],
    // remove sampled lines
    ['remove', '#money-interest', {delay: 500, duration: 500}],
    ['remove', '#money-interest-2', {delay: 1250, duration: 500}],
    ['remove', '#money-interest-3', {delay: 2000, duration: 500}],
    ['remove', '#money-balance', {delay: 1000, duration: 500}],
    ['remove', '#money-interest-intersection', {delay: 2000, duration: 500}],
    ['remove', '#money-interest-intersection-2', {delay: 2000, duration: 500}],
    ['remove', '#money-interest-intersection-3', {delay: 2000, duration: 500}],
  ],

  // show IS line
  [
    // reset camera
    ['animate', 'camera', {
      phi: τ/4,
      theta: 0,
    }, {
      duration: 1500,
    }],
    // rotate viewport
    ['animate', 'viewport', {
      rotation: [-τ/4, 0, 0],
    }, {
      duration: 1500,
    }],
    // project
    ['animate', 'viewport', {
      scale: [1, 0.001, 1],
    }, {
      delay: 1000,
      duration: 1500,
    }],
    // hide axes
    ['animate', '#y2-axis', { opacity: 0 }, { duration: 1500, delay: 1000 }],
    ['animate', '#xy-plane', { opacity: 0 }, { duration: 1500, delay: 1000 }],
    ['animate', '#yz-plane', { opacity: 0 }, { duration: 1500, delay: 1000 }],
    // hide planes
    ['animate', '#money-interest-plane', {
      opacity: 0,
    }, {
      duration: 1500,
      delay: 1000
    }],
    ['animate', '#money-balance-surface', {
      opacity: 0,
    }, {
      duration: 1500,
      delay: 1000
    }],
    // bring back is line
    ['animate', '#is-line', { opacity: 1 }, {duration: 500, delay: 2500}]
  ],
];

$(function() {

  ThreeBox.preload([
    'scripts/snippets.glsl.html',
  ], function () {

    // MathBox boilerplate
    var mathboxElement = document.getElementById('mathbox-container');
    var mathbox = window.mathbox = mathBox(mathboxElement, {
      cameraControls: false,
      cursor:         true,
      controlClass:   ThreeBox.OrbitControls,
      elementResize:  true,
      fullscreen:     true,
      screenshot:     true,
      stats:          false,
      scale:          1,
    }).start();

    // Set up director
    var script = window.mathboxScript;
    var director = window.director = new MathBox.Director(mathbox, script);
    setSlide();

    // Arrow controls
    // Controls for stand-alone
    window.addEventListener('touchstart', function (e) {
      director.forward();
      setSlide();
    });
    window.addEventListener('keydown', function (e) {
      if (e.keyCode == 38 || e.keyCode == 37) director.back();
      else if (e.keyCode == 40 || e.keyCode == 39) director.forward();
      else { return; }
      setSlide();
    });

    // Next / Prev
    $("#next").click(function(e) {
      director.forward();
      setSlide();
    })
    $("#prev").click(function(e) {
      director.back();
      setSlide();
    })

    function setSlide() {
      $("#text > div").hide();
      $("#text > div").eq(director.step).show();
      document.getElementById('info').style.opacity = '0';

      dimensions.forEach(function(value, index) {

      })
    }

    window.mathboxSetup(mathbox);


    // PLAYING AROUND
    mathbox
    // Add XYZ axes
    .axis({
      id: 'x-axis',
      axis: 0,
      color: 0x00ff00,
      ticks: 2,
      lineWidth: 2,
      size: .05,
      labels: false,
    })
    .axis({
      id: 'y-axis',
      axis: 1,
      color: 0xff0000,
      ticks: 2,
      lineWidth: 2,
      size: .05,
      labels: false,
      zero: false,
    })
    .axis({
      id: 'y2-axis',
      axis: 1,
      color: 0xff8000,
      ticks: 2,
      lineWidth: 2,
      size: .05,
      labels: false,
      zero: false,
      opacity: 0,
    })
    .axis({
      id: 'z-axis',
      axis: 2,
      color: 0x0000ff,
      ticks: 2,
      lineWidth: 2,
      size: .05,
      zero: false,
      labels: false,
      opacity: 0
    })
    // Grid
    .grid({
      id: 'xy-plane',
      axis: [0, 1],
      ticks: [ 10, 10 ],
      color: 0xc0c0c0,
      lineWidth: 1,
      opacity: 0.5
    })
    .grid({
      id: 'xz-plane',
      axis: [0, 2],
      ticks: [ 10, 10 ],
      color: 0xc0c0c0,
      lineWidth: 1,
      opacity: 0
    })
    .grid({
      id: 'yz-plane',
      axis: [1, 2],
      ticks: [ 10, 10 ],
      color: 0xc0c0c0,
      lineWidth: 1,
      opacity: 0
    })
    // Labels
    .label({
      id: 'x-label',
      position: [1, 0, 0],
      text: 'Income',
      distance: 15,
      facing: 1,
      className: 'mathbox-label axis-label'
    })
    .label({
      id: 'y-label',
      position: [0, 1, 0],
      text: 'Expenditure',
      distance: 15,
      facing: 1,
      className: 'mathbox-label axis-label'
    })
    .label({
      id: 'z-label',
      position: [0, 0, 1],
      text: 'Interest rate',
      distance: 15,
      facing: 1,
      opacity: 0,
      className: 'mathbox-label axis-label'
    })

    .label({
      id: 'eq-label',
      expression: __.partial(IS3D, 0),
      text: 'Equilibrium',
      distance: 15,
      facing: 1,
      opacity: 0,
      className: 'mathbox-label point-label'
    })
    .label({
      id: 'eq-label-1',
      expression: __.partial(IS3D, 0),
      text: 'Equilibrium at lower interest rate',
      distance: 15,
      facing: 1,
      opacity: 0,
      className: 'mathbox-label point-label'
    })
    .label({
      id: 'eq-label-2',
      expression: __.partial(IS3D, 1),
      text: 'Equilibrium at higher interest rate',
      distance: 15,
      facing: 1,
      opacity: 0,
      className: 'mathbox-label point-label'
    })

  });

});


var width = 500;

var x = d3.scale.linear()
  .domain([0, 1])
  .range([0, width])
  .clamp(true);

var dispatch = d3.dispatch("sliderChange");


var sliderContainer = d3.select("#dimensions").selectAll(".slider-container")
  .data(dimensions)
  .enter()
  .append("div")
  .classed("slider-container", true);

sliderContainer.append("p").text(function(d) { return d.name; });

sliderContainer.append("div")
  .classed("slider", true);

var slider = d3.selectAll(".slider")
  .style("width", width + "px");

var sliderTray = slider.append("div")
  .attr("class", "slider-tray");

var sliderHandle = slider.append("div")
  .attr("class", "slider-handle");

sliderHandle.append("div")
  .attr("class", "slider-handle-icon")

slider.call(d3.behavior.drag()
  .on("dragstart", function(d,i) {
    dispatch.sliderChange(d, x.invert(d3.mouse(sliderTray.node())[0]));
    d3.event.sourceEvent.preventDefault();
  })
  .on("drag", function(d,i) {
    dispatch.sliderChange(d, x.invert(d3.mouse(sliderTray.node())[0]));
  }));

dispatch.on("sliderChange.slider", function(d, value) {
  var slider = d3.selectAll('.slider').filter(function(dd) { return dd==d; });
  slider.select('.slider-handle').style("left", x(value) + "px");
  d.value = value;
});
// dispatch.sliderChange(dimensions[4], savingsRate);
