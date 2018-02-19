import Scene from "@pencil.js/scene";
import Slider from "@pencil.js/slider";
import Rectangle from "@pencil.js/rectangle";
import Vector from "@pencil.js/vector";
import Container from "@pencil.js/container";
import Position from "@pencil.js/position";


let scene = new Scene(document.body, {
    fill: "#CCC"
});
scene.startLoop();

let nbSliders = 3;
let sliderHeight = Slider.HEIGHT + 20;
let equalizer = new Rectangle(new Position(200, 100), 50 + 200 + 10, nbSliders * sliderHeight + 10 + 20, {
    fill: "#666",
    stroke: "#333"
});
scene.addChild(equalizer);
equalizer.draggable();
equalizer.resizable({
    constrain: new Vector(50 + Slider.HEIGHT + 10, sliderHeight + 20, Infinity, 10 * sliderHeight + 20)
});

equalizer.addChild(new Text(new Position(10, 5), "Equalizer", {
    fill: "#FFF",
    fontSize: 15
}));

let sliderList = [];
function addSlider (index) {
    let y = 10 + 20 + index * sliderHeight;

    let wrapper = new Container(new Position(10, y));
    let valueText = new Text(new Position(), "0", {
        fontSize: Slider.HEIGHT,
        fill: "#FFF"
    });
    wrapper.addChild(valueText);

    let slider = new Slider(new Position(40, 0), {
        max: 99,
        width: 200
    });
    wrapper.addChild(slider);
    slider.on("change", () => valueText.text = slider.value << 0);
    sliderList.push(wrapper);
    return wrapper;
}

equalizer.on("resize", function () {
    let nbChildren = (this.height - 10 - 20) / sliderHeight;

    if (sliderList.length > nbChildren) {
        sliderList.pop().remove();
    }
    else if (sliderList.length < nbChildren - 1) {
        this.addChild(addSlider(sliderList.length));
    }

    sliderList.forEach(function (child) {
        child.children.find(sub => sub instanceof Slider).width = this.width - 50 - 10;
    }, this);
});

for (let i = 0; i < nbSliders; ++i) {
    equalizer.addChild(addSlider(i));
}
