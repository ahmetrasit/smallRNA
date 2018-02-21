from django.db import models


class GenotypeOptions:
    name = models.CharField(max_length=20)
    created_by = models.CharField(max_length=50)
    created_on = models.DateTimeField(auto_now=True)


class SampleTypeOptions:
    name = models.CharField(max_length=20)
    created_by = models.CharField(max_length=50)
    created_on = models.DateTimeField(auto_now=True)


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
