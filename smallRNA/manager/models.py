from django.db import models


class GenotypeOptions(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    created_by = models.TextField()
    created_on = models.DateTimeField(auto_now=True)


class SampleTypeOptions(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    created_by = models.TextField()
    created_on = models.DateTimeField(auto_now=True)


#Basic processes like remove adapter, trim, align, etc.
#Designed for simple events having one input and one output
#For a complex design, I could use my NextFlow tool, but it's unnecessary here
#Just chain inputs and outputs
class BashProcess(models.Model):
    name = models.CharField(max_length=50)
    process_type = models.CharField(max_length=20) #python, bash, R
    status = models.CharField(max_length=20)
    inputs = models.TextField() #i:file/database/html_input:type:name
    outputs = models.TextField() #o:file/database/html_input:type:name
    parameters = models.TextField()
    description = models.TextField()
    script = models.TextField()
    created_by = models.TextField()
    created_on = models.DateTimeField(auto_now=True)


class Experiment(models.Model):
    name = models.TextField()
    description = models.TextField()
    date = models.CharField(max_length=100)
    facility = models.TextField()
    protocol = models.TextField()


class PreProcessingWorkflow(models.Model):
    pass


class AnalysisWorkflow(models.Model):
    pass


class VisualizationWorkflow(models.Model):
    pass


class AlignmentWorkflow(models.Model):
    pass


class PreProcessingEvent(models.Model):
    pass


class EventManager(models.Model):
    pass
