
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
}

const rotPar = [[1, Math.radians(0.4738/3600), Math.radians(0.0003/3600)], 
                [Math.radians(-0.4738/3600), 1, Math.radians(0.0183/3600)],
                [Math.radians(-0.0003/3600), Math.radians(-0.0183/3600), 1]]

const wgs84coord = [3869416.913, 2830423.682, 4192997.6984]

const scaleWgs84 = -1.0347/1000000

const offsetXYZt = [84.003, 102.315, 129.879]

const rotatedCoord = multiply(rotPar,wgs84coord);

const scaledCoord = wgs84coord.map(el=>el*scaleWgs84)

const sum1= add(rotatedCoord, scaledCoord, offsetXYZt)

console.log(sum1);
