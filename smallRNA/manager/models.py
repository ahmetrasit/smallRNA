from django.db import models


class GenotypeOptions:
    name = models.CharField(max_length=20)
    description = models.TextField()
    created_by = models.TextField()
    created_on = models.DateTimeField(auto_now=True)


class SampleTypeOptions:
    name = models.CharField(max_length=20)
    description = models.TextField()
    created_by = models.TextField()
    created_on = models.DateTimeField(auto_now=True)


#Basic processes like remove adapter, trim, align, etc.
#Designed for simple events having one input and one output
#For a complex design, I could use my NextFlow tool, but it's unnecessary here
#Just chain inputs and outputs
class BashProcess:
    name = models.CharField(max_length=50)
    process_type = models.CharField(max_length=20) #python, bash, R
    status = models.CharField(max_length=20)
    inputs = models.TextField()
    outputs = models.TextField()
    parameters = models.TextField()
    description = models.TextField()
    command = models.TextField()
    created_by = models.TextField()
    created_on = models.DateTimeField(auto_now=True)


class Experiment:
    name = models.TextField()
    description = models.TextField()
    date = models.CharField(max_length=100)
    facility = models.TextField()
    protocol = models.TextField()


class PreProcessingWorkflow:
    pass


class AnalysisWorkflow:
    pass


class VisualizationWorkflow:
    pass


class AlignmentWorkflow:
    pass


class PreProcessingEvent:
    pass


class EventManager:
    pass
