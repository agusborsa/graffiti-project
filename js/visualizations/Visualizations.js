/*
*
* Visualizations();
* manage all the visualizations from here :)
*/

class Visualizations{

	/*
	*
	* constructor();
	* define the setup variables inside the constructor
	*/

	constructor(_p){

		console.log("constructor");

		this.x = 20;

		this.y = 20;

		this.actualVisualization = 0;

		this.primaryColor = '#ffffff';

		this.secondaryColor = '#ffffff';

		this.isDrawing = false;

		this.p = _p;
	}

	/*
	*
	* setup();
	* initial setup for all the components...
	*/

	setup(actualVisualization, primaryColor, secondaryColor){

		this.actualVisualization = actualVisualization;

		this.primaryColor = primaryColor;

		this.secondaryColor = secondaryColor;

		this.tintDraw = new TintDraw(this.p);

		this.tintDraw.setup(this.primaryColor, this.secondaryColor);

		

		

	}

	/*
	*
	* update(actualVisualization);
	* update the data...
	*/

	run = () =>{



			this.tintDraw.run(this.isDrawing, this.x, this.y);

		

	}

}