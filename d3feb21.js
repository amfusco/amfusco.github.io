console.log("Women of Color in Congress");

d3.csv("women_of_color_congress.csv", function (error, data) {
    console.log(data);
});