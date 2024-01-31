---
layout: post
title: Re-thinking onboard localization
---


# Re-thinking onboard localization
# 

Before I was a backend engineer, I was a roboticist. I studied an algorithm called SLAM and wrote several implementations of various components. SLAM stands for **S**imultaneous **L**ocalization **a**nd **M**apping, which is the act of building a map while simultaneously figuring out where you are inside the map.

Being a backend engineer has made me rethink how I define systems. For me before, we had a fixed amount of resources and we had to build systems like localization within said constraints. Being a backend engineer, the constraints are very different, and we have a lot more resources to work with, as well as a different paradigm of doing work. Things like event-based programming or async coroutines, which you would never think about in an embedded system since it takes too long to process, suddenly become very viable.

One project that I think could have benefited from moving to an async / online backend system is localization initialization. In general, localization needs some kind of initial guess to start up. It can be coarse and refined in the algorithm, but it is needed.

While at TRI, we developed a more accurate initializer that gave us an error range down to a half-meter. For autonomous cars, this is really great. The issue is that it is really slow. Like, takes several seconds to compute slow, and a high amount of CPU resources slow. We ran this initializer at a highly reduced rate (maybe once every few seconds) to get around this.

Knowing what I know now, my thought is: can we offload this to the cloud and use the cloud’s resources to run the initializer? It’s not like the initializer needs to constantly be running — we could get an initialization solution whenever we lose track, make an API request to the server, and get back a localization solution when we need it,

Here’s a diagram of how such a system would work:

![loc_init_3.png](Re-thinking%20onboard%20localization%20f3c74f17c1fe4554a0cb375a564de2c6/loc_init_3.png)

Here’s an example of the API we could build using FastAPI:

```python
def FeatureUpload(BaseModel):
	features: typing.List[Feature]
	timestamp: datetime.datetime

def GpsUpload(BaseModel):
	gps_coordinate: typing.Tuple[float, float, float]
	timestamp: datetime.datetime

@router.post("/features")
async def upload_features(features: FeatureUpload):
	...

@router.post("/gps")
async def upload_gps(gps: GpsUpload):
	...

@router.get("/solution")
async def retrieve_solution():
	...
```

Some notes about this system:

- We would likely want to ensure that the cloud-based localizer and the on-vehicle localizer maps are synchronized.
- The features likely need to be compressed in some way. This really depends on how you define features — are they lines? Are they polylines? How many features do you store? How many features can you send upstream via internet connection? All these questions need to be answered before you can commit to designing a system like this.
- The GPS coordinates are pretty lightweight, I don’t think you need to do any serious compression there.
- Odometry is another problem we’d have to think about. This usually comes in at 200Hz, and would overload the API server with way too many requests. Most odometry isn’t super needed for cloud localization so you could probably downsample the odometry and be okay. Again, very implementation dependent.
- This all really depends on an internet connection that’s constantly uploading data and has no lag. It would be good to reject older timestamps that don’t fit into this model, and that could be checked with a separate API call to the cloud service.
- I think we could do a whole section on what these two localizers look like, what requirements each of them have, and how to deal with bad data, loss of internet / connectivity, storage, logging, and error handling. Perhaps that’ll be the next few posts.
    - Ideally the on-vehicle localizer would act as a low-cost, high rate initializer that is constantly providing a solution whenever queried to downstream users.
    - The cloud-based localizer is one that acts as a backup system to reset the on-vehicle localization whenever it fails. This one essentially needs to keep the vehicle state and the on-cloud state in sync, and it doesn’t need all the data all the time.

I think for next posts we will delve into how to build a SLAM system, starting with definitions and first principles. That means:

- what do your features look like?
- How will you create a map from said features?
- How will you run feature associations?
- How will you update the map?
