from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date, time
from kerykeion import KrInstance, Report
from typing import Optional

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BirthChartRequest(BaseModel):
    name: str
    birthDate: str
    birthTime: str
    latitude: float
    longitude: float

@app.post("/calculate")
async def calculate_birth_chart(request: BirthChartRequest):
    try:
        # Parse date and time
        year, month, day = map(int, request.birthDate.split('-'))
        hour, minute = map(int, request.birthTime.split(':'))

        # Create birth chart
        chart = KrInstance(
            name=request.name,
            year=year,
            month=month,
            day=day,
            hour=hour,
            minute=minute,
            lat=request.latitude,
            lng=request.longitude
        )

        # Get positions
        return {
            "sunSign": chart.sun['sign'],
            "moonSign": chart.moon['sign'],
            "ascendantSign": chart.asc['sign']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)